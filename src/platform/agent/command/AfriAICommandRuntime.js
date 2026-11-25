import AfriAgentIdentityRegistry from "../identity/AfriAgentIdentityRegistry.js";
import AfriAgentCapabilityRegistry from "../registry/AfriAgentCapabilityRegistry.js";
import AfriAgentHarnessRuntime from "../harness/runtime/AfriAgentHarnessRuntime.js";
import { buildAfriAICommandPlanWithAI } from "./AfriAICommandPlanner.js";
import { afriAIRuntime } from "../../../../modules/afriai/runtime/AfriAIRuntime.js";
import AfriAgentDelegationExecutor from "../harness/orchestration/AfriAgentDelegationExecutor.js";

const AGENT_ID = "AGENT-AFRIAICOMMAND-001";
const PROVIDER_ID = "afriaicommand-command-provider";
const CAPABILITY_ID = "afriaicommand.execute";

export function createAfriAICommandRuntime({
  identityRegistry = AfriAgentIdentityRegistry,
  capabilityRegistry = AfriAgentCapabilityRegistry,
  harnessRuntime = AfriAgentHarnessRuntime,
  planner = buildAfriAICommandPlanWithAI,
  reasoner = prompt => afriAIRuntime.generateStructuredPlan(prompt),
  delegationExecutor = AfriAgentDelegationExecutor
} = {}) {

  const provider = {
    async execute({ task, context = {} } = {}) {
      if (
        context.executionChannel &&
        context.executionChannel !== "INTERNAL_ADMIN"
      ) {
        throw new Error("AFRIAICOMMAND_EXECUTION_CHANNEL_FORBIDDEN");
      }

      const objective =
        task?.objective ||
        task?.payload?.objective ||
        task?.input?.objective;

      return planner({
        objective,
        agents: identityRegistry.list(),
        capabilities: capabilityRegistry.list(),
        requesterAgentId: AGENT_ID,
        reasoner
      });
    }
  };

  return {
    initialize() {
      const existingCapability = capabilityRegistry.get(CAPABILITY_ID);
      if (!existingCapability) {
        capabilityRegistry.register({
          id: CAPABILITY_ID,
          service: "AfriAICommand",
          description:
            "Plan internal AfriDigital agent tasks using live registry discovery.",
          enabled: true,
          adminOnly: false,
          internalOnly: true,
          handler: provider.execute
        });
      } else if (
        existingCapability.enabled !== true ||
        existingCapability.adminOnly !== false ||
        existingCapability.internalOnly !== true ||
        existingCapability.handler !== provider.execute
      ) {
        throw new Error("AFRIAICOMMAND_CAPABILITY_CONFIGURATION_CONFLICT");
      }

      if (!harnessRuntime.getProvider(PROVIDER_ID)) {
        harnessRuntime.registerProvider(PROVIDER_ID, provider);
      }

      let agent = identityRegistry.get(AGENT_ID);

      if (!agent) {
        agent = identityRegistry.register({
          id: AGENT_ID,
          key: null,
          name: "AfriAICommand Agent",
          organizationId: "afridigital",
          trustDomain: "INTERNAL",
          provider: PROVIDER_ID,
          capabilities: [CAPABILITY_ID]
        });
      } else {
        if (
          (agent.provider && agent.provider !== PROVIDER_ID) ||
          !Array.isArray(agent.capabilities) ||
          !agent.capabilities.includes(CAPABILITY_ID)
        ) {
          throw new Error("AFRIAICOMMAND_IDENTITY_CONFIGURATION_CONFLICT");
        }

        if (!agent.provider) {
          agent = identityRegistry.bindProvider(AGENT_ID, PROVIDER_ID);
        }
      }

      return {
        initialized: true,
        agentId: AGENT_ID,
        providerId: PROVIDER_ID,
        capability: CAPABILITY_ID,
        executionChannel: "INTERNAL_ADMIN"
      };
    },

    async plan(objective) {
      return planner({
        objective,
        agents: identityRegistry.list(),
        capabilities: capabilityRegistry.list(),
        requesterAgentId: AGENT_ID,
        reasoner
      });
    },

    // Backward-compatible alias. Planning only; never delegates.
    async execute(objective) {
      return this.plan(objective);
    },

    // Delegation remains a separate, independently approval-gated operation.
    async executeApproved({ approvalId, requesterId, plan, context = {} } = {}) {
      return delegationExecutor.execute({
        approvalId,
        requesterId,
        plan,
        context
      });
    }
  };
}

const AfriAICommandRuntime = createAfriAICommandRuntime();

export default AfriAICommandRuntime;
