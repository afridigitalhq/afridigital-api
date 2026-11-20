import AfriAgentIdentityRegistry from "../../identity/AfriAgentIdentityRegistry.js";
import AfriAgentCapabilityRegistry from "../../registry/AfriAgentCapabilityRegistry.js";
import AfriInternalA2AHttpClient from "../../security/AfriInternalA2AHttpClient.js";
import { validateAfriAgentExecutionPlan } from "./AfriAgentExecutionPlan.js";

const SOURCE_AGENT_ID = "AGENT-AFRIAICOMMAND-001";
const MAX_STEPS = 12;
const MAX_RESULT_BYTES = 64 * 1024;

function fail(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

function serializeResult(result, errorCode) {
  let serialized;
  try {
    serialized = JSON.stringify(result === undefined ? null : result);
  } catch {
    fail(errorCode("RESULT_NOT_SERIALIZABLE"));
  }
  if (typeof serialized !== "string") {
    fail(errorCode("RESULT_NOT_SERIALIZABLE"));
  }
  if (Buffer.byteLength(serialized, "utf8") > MAX_RESULT_BYTES) {
    fail(errorCode("RESULT_TOO_LARGE"));
  }
  return JSON.parse(serialized);
}

function safeError(error) {
  const code = error?.code || error?.message;
  return typeof code === "string" && /^[A-Z0-9_:-]{1,100}$/.test(code)
    ? code
    : "AGENT_EXECUTION_FAILED";
}

export function createAfriAgentDelegationExecutor({
  approvalAuthority,
  identityRegistry = AfriAgentIdentityRegistry,
  capabilityRegistry = AfriAgentCapabilityRegistry,
  internalTaskClient = AfriInternalA2AHttpClient,
  sourceAgentId = SOURCE_AGENT_ID,
  sourceCapabilityId = "afriaicommand.execute",
  serviceName = "AfriAICommand",
  errorPrefix = "AFRIAICOMMAND",
  maxConcurrency = 2
} = {}) {
  if (
    typeof sourceAgentId !== "string" || !sourceAgentId.trim() ||
    typeof sourceCapabilityId !== "string" || !sourceCapabilityId.trim() ||
    typeof serviceName !== "string" || !serviceName.trim() || serviceName.trim().length > 80 ||
    typeof errorPrefix !== "string" || !/^[A-Z][A-Z0-9_]{0,39}$/.test(errorPrefix) ||
    !Number.isInteger(maxConcurrency) || maxConcurrency < 1 || maxConcurrency > 4
  ) {
    fail("AFRI_DELEGATION_EXECUTOR_CONFIG_INVALID");
  }

  const trustedSourceAgentId = sourceAgentId.trim();
  const trustedSourceCapabilityId = sourceCapabilityId.trim();
  const trustedServiceName = serviceName.trim();
  const errorCode = suffix => `${errorPrefix}_${suffix}`;
  if (!internalTaskClient || typeof internalTaskClient.execute !== "function") {
    fail(errorCode("INTERNAL_HTTP_CLIENT_UNAVAILABLE"));
  }

  return {
    async execute({ approvalId, requesterId, plan, context = {} } = {}) {
      if (!approvalAuthority || typeof approvalAuthority.consume !== "function") {
        fail(errorCode("APPROVAL_AUTHORITY_UNAVAILABLE"));
      }
      if (typeof approvalId !== "string" || !approvalId.trim()) {
        fail(errorCode("APPROVAL_REQUIRED"));
      }
      if (typeof requesterId !== "string" || !requesterId.trim()) {
        fail(errorCode("REQUESTER_REQUIRED"));
      }
      if (!context || typeof context !== "object" || Array.isArray(context)) {
        fail(errorCode("CONTEXT_INVALID"));
      }
      if (
        !plan ||
        plan.status !== "PREVIEW" ||
        plan.planningMode !== "AI_STRUCTURED" ||
        plan.requiresApprovalBeforeDelegation !== true ||
        plan.executionStarted !== false ||
        plan.executionChannel !== "INTERNAL_ADMIN" ||
        plan.paymentPolicy !== "NO_AUTOMATIC_PAYMENT"
      ) {
        fail(errorCode("PLAN_NOT_EXECUTABLE"));
      }

      const source = identityRegistry.get(trustedSourceAgentId);
      if (!source || source.status !== "ACTIVE" || source.trustDomain !== "INTERNAL") {
        fail(errorCode("SOURCE_AGENT_NOT_AUTHORIZED"));
      }
      const sourceCapability = capabilityRegistry.get(trustedSourceCapabilityId);
      if (
        !sourceCapability ||
        sourceCapability.enabled !== true ||
        sourceCapability.adminOnly === true ||
        !Array.isArray(source.capabilities) ||
        !source.capabilities.includes(trustedSourceCapabilityId)
      ) {
        fail(errorCode("SOURCE_CAPABILITY_NOT_AUTHORIZED"));
      }

      const validated = validateAfriAgentExecutionPlan({
        objective: plan.objective,
        proposedPlan: {
          summary: plan.summary,
          steps: plan.steps
        },
        agents: identityRegistry.list(),
        capabilities: capabilityRegistry.list(),
        requesterAgentId: trustedSourceAgentId
      });

      if (validated.steps.length > MAX_STEPS) {
        fail(errorCode("PLAN_STEPS_INVALID"));
      }

      // Revalidate every target against live registries before consuming approval.
      // Keep the later execution-time check as protection against authorization races.
      for (const step of validated.steps) {
        const agent = identityRegistry.get(step.agentId);
        const capability = capabilityRegistry.get(step.capability);

        if (
          !agent ||
          agent.status !== "ACTIVE" ||
          !capability ||
          capability.enabled !== true ||
          capability.adminOnly === true ||
          !Array.isArray(agent.capabilities) ||
          !agent.capabilities.includes(step.capability)
        ) {
          fail("AFRI_AGENT_EXECUTION_PLAN_CAPABILITY_NOT_ELIGIBLE");
        }
      }

      // Consume only after all live authorization checks have passed.
      await approvalAuthority.consume({
        approvalId: approvalId.trim(),
        sourceAgentId: trustedSourceAgentId,
        requesterId: requesterId.trim(),
        plan
      });

      const results = Array(validated.steps.length).fill(null);
      const startedAt = new Date().toISOString();
      const pending = new Set(validated.steps.map(step => step.step));

      const runStep = async step => {
        const stepStartedAt = new Date().toISOString();

        try {
          const agent = identityRegistry.get(step.agentId);
          const capability = capabilityRegistry.get(step.capability);

          if (
            !agent ||
            agent.status !== "ACTIVE" ||
            !capability ||
            capability.enabled !== true ||
            capability.adminOnly === true ||
            !Array.isArray(agent.capabilities) ||
            !agent.capabilities.includes(step.capability)
          ) {
            fail(errorCode("LIVE_AUTHORIZATION_FAILED"));
          }

          const dependencyResults = step.dependsOn.map(number => {
            const dependency = results[number - 1];
            if (!dependency || dependency.status !== "COMPLETED") {
              fail(errorCode("DEPENDENCY_NOT_COMPLETED"));
            }
            return {
              step: number,
              agentId: dependency.agentId,
              capability: dependency.capability,
              result: dependency.result
            };
          });

          const result = await internalTaskClient.execute({
            agentId: step.agentId,
            task: {
              capability: step.capability,
              payload: {
                objective: step.task,
                dependencyResults
              }
            },
            context: {
              ...context,
              planObjective: validated.objective,
              planSummary: validated.summary,
              step: step.step,
              dependsOn: step.dependsOn,
              executionChannel: "INTERNAL_ADMIN",
              paymentPolicy: "NO_AUTOMATIC_PAYMENT"
            }
          });

          results[step.step - 1] = {
            step: step.step,
            agentId: step.agentId,
            capability: step.capability,
            status: "COMPLETED",
            startedAt: stepStartedAt,
            completedAt: new Date().toISOString(),
            result: serializeResult(result, errorCode)
          };
        } catch (error) {
          results[step.step - 1] = {
            step: step.step,
            agentId: step.agentId,
            capability: step.capability,
            status: "FAILED",
            startedAt: stepStartedAt,
            completedAt: new Date().toISOString(),
            errorCode: safeError(error)
          };
        }
      };

      while (pending.size > 0) {
        const ready = [];
        const selectedAgents = new Set();

        for (const step of validated.steps) {
          if (!pending.has(step.step)) continue;

          const dependencies = step.dependsOn.map(number => results[number - 1]);

          if (dependencies.some(dependency => dependency && dependency.status !== "COMPLETED")) {
            results[step.step - 1] = {
              step: step.step,
              agentId: step.agentId,
              capability: step.capability,
              status: "SKIPPED",
              errorCode: errorCode("DEPENDENCY_NOT_COMPLETED")
            };
            pending.delete(step.step);
            continue;
          }

          if (dependencies.some(dependency => !dependency)) continue;
          if (selectedAgents.has(step.agentId)) continue;

          ready.push(step);
          selectedAgents.add(step.agentId);

          if (ready.length >= maxConcurrency) break;
        }

        if (ready.length === 0) {
          for (const step of validated.steps) {
            if (!pending.has(step.step)) continue;
            results[step.step - 1] = {
              step: step.step,
              agentId: step.agentId,
              capability: step.capability,
              status: "SKIPPED",
              errorCode: errorCode("DEPENDENCY_NOT_COMPLETED")
            };
            pending.delete(step.step);
          }
          break;
        }

        for (const step of ready) pending.delete(step.step);
        await Promise.all(ready.map(runStep));
      }

      results.sort((a, b) => a.step - b.step);

      const completed = results.filter(item => item.status === "COMPLETED").length;
      const failed = results.filter(item => item.status === "FAILED").length;
      const skipped = results.filter(item => item.status === "SKIPPED").length;
      const status = failed === 0 && skipped === 0
        ? "COMPLETED"
        : completed > 0
          ? "PARTIAL"
          : "FAILED";

      return {
        service: trustedServiceName,
        status,
        approvalId: approvalId.trim(),
        planningMode: "AI_STRUCTURED",
        objective: validated.objective,
        summary: validated.summary,
        executionStarted: true,
        executionChannel: "INTERNAL_ADMIN",
        paymentPolicy: "NO_AUTOMATIC_PAYMENT",
        totals: { steps: results.length, completed, failed, skipped },
        startedAt,
        completedAt: new Date().toISOString(),
        steps: results
      };
    }
  };
}

// No production approval authority is configured by default: execution fails closed.
const AfriAgentDelegationExecutor = createAfriAgentDelegationExecutor();

export { SOURCE_AGENT_ID };
export default AfriAgentDelegationExecutor;
