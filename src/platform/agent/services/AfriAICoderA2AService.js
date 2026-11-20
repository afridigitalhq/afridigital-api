const capabilities = Object.freeze([
  {
    id: "engineering.backend",
    service: "AfriAICoder",
    description: "Backend engineering, API implementation, database integration and server-side development."
  },
  {
    id: "engineering.web",
    service: "AfriAICoder",
    description: "Web application engineering, frontend implementation and interface integration."
  },
  {
    id: "engineering.android",
    service: "AfriAICoder",
    description: "Native Android engineering, application architecture, APK builds and mobile integration."
  },
  {
    id: "engineering.ai",
    service: "AfriAICoder",
    description: "AI application engineering, model integration, agent systems and orchestration."
  },
  {
    id: "engineering.devops",
    service: "AfriAICoder",
    description: "DevOps engineering, Termux and Linux workflows, CI/CD, deployment and infrastructure automation."
  },
  {
    id: "engineering.blockchain",
    service: "AfriAICoder",
    description: "Blockchain application engineering, smart contracts and authorized integration testing."
  },
  {
    id: "engineering.security",
    service: "AfriAICoder",
    description: "Secure implementation, defensive security engineering, remediation and authorized security testing."
  },
  {
    id: "engineering.architecture",
    service: "AfriAICoder",
    description: "Software architecture, technical design, integration planning and engineering documentation."
  }
].map(item => Object.freeze(item)));

const CAPABILITY_IDS = new Set(capabilities.map(item => item.id));
const DEFAULT_AGENT_ID = "AGENT-AFRIAICODER-001";

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateAdapter(adapter) {
  if (
    adapter !== null &&
    (!isRecord(adapter) || typeof adapter.execute !== "function")
  ) {
    throw new Error("AFRIAICODER_EXECUTION_ADAPTER_INVALID");
  }
}

export function createAfriAICoderA2AService({
  adapter = null,
  agentId = DEFAULT_AGENT_ID
} = {}) {
  validateAdapter(adapter);

  if (typeof agentId !== "string" || !agentId.trim()) {
    throw new Error("AFRIAICODER_AGENT_ID_INVALID");
  }

  let executionAdapter = adapter;

  return {
    capabilities,

    isExecutionAdapterConfigured() {
      return executionAdapter !== null;
    },

    configureExecutionAdapter(nextAdapter) {
      validateAdapter(nextAdapter);

      if (!nextAdapter) {
        throw new Error("AFRIAICODER_EXECUTION_ADAPTER_REQUIRED");
      }

      executionAdapter = nextAdapter;
      return true;
    },

    clearExecutionAdapter() {
      executionAdapter = null;
    },

    async execute(payload = {}, context = {}) {
      if (!isRecord(payload)) {
        throw new Error("AFRIAICODER_TASK_PAYLOAD_INVALID");
      }

      if (!isRecord(context)) {
        throw new Error("AFRIAICODER_EXECUTION_CONTEXT_INVALID");
      }

      if (context.agentId !== agentId) {
        throw new Error("AFRIAICODER_TRUSTED_IDENTITY_INVALID");
      }

      const capability = context.capability;

      if (typeof capability !== "string" || !CAPABILITY_IDS.has(capability)) {
        throw new Error("AFRIAICODER_CAPABILITY_NOT_FOUND");
      }

      const objective = payload.objective;

      if (
        typeof objective !== "string" ||
        !objective.trim() ||
        objective.trim().length > 2000
      ) {
        throw new Error("AFRIAICODER_OBJECTIVE_INVALID");
      }

      const dependencyResults = payload.dependencyResults ?? [];

      if (
        !Array.isArray(dependencyResults) ||
        dependencyResults.length > 12
      ) {
        throw new Error("AFRIAICODER_DEPENDENCY_RESULTS_INVALID");
      }

      if (!executionAdapter) {
        throw new Error("AFRIAICODER_EXECUTION_ADAPTER_NOT_CONFIGURED");
      }

      const task = {
        objective: objective.trim(),
        dependencyResults
      };

      const serialized = JSON.stringify(task);

      if (
        typeof serialized !== "string" ||
        Buffer.byteLength(serialized, "utf8") > 65536
      ) {
        throw new Error("AFRIAICODER_TASK_SIZE_LIMIT_EXCEEDED");
      }

      return executionAdapter.execute({
        agentId,
        capability,
        task,
        context: {
          taskId: context.taskId ?? null,
          sourceAgentId: context.sourceAgentId ?? null,
          executionChannel: context.executionChannel ?? null,
          paymentPolicy: context.paymentPolicy ?? null
        }
      });
    }
  };
}

const AfriAICoderA2AService = createAfriAICoderA2AService();

export default AfriAICoderA2AService;
