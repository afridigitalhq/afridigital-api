function fail(code) {
  throw new Error(code);
}

function eligible(agent, capability, requesterAgentId) {
  return Boolean(
    agent &&
    capability &&
    agent.id !== requesterAgentId &&
    agent.status === "ACTIVE" &&
    capability.enabled === true &&
    capability.adminOnly !== true &&
    Array.isArray(agent.capabilities) &&
    agent.capabilities.includes(capability.id)
  );
}

export function validateAfriAgentExecutionPlan({
  objective,
  proposedPlan,
  agents = [],
  capabilities = [],
  requesterAgentId
} = {}) {
  if (typeof objective !== "string" || !objective.trim()) {
    fail("AFRI_AGENT_EXECUTION_PLAN_OBJECTIVE_INVALID");
  }
  if (!proposedPlan || typeof proposedPlan !== "object" || Array.isArray(proposedPlan)) {
    fail("AFRI_AGENT_EXECUTION_PLAN_INVALID");
  }
  if (
    typeof proposedPlan.summary !== "string" ||
    !proposedPlan.summary.trim() ||
    proposedPlan.summary.length > 1000
  ) {
    fail("AFRI_AGENT_EXECUTION_PLAN_SUMMARY_INVALID");
  }
  if (
    !Array.isArray(proposedPlan.steps) ||
    proposedPlan.steps.length < 1 ||
    proposedPlan.steps.length > 12
  ) {
    fail("AFRI_AGENT_EXECUTION_PLAN_STEPS_INVALID");
  }
  if (!Array.isArray(agents) || !Array.isArray(capabilities)) {
    fail("AFRI_AGENT_EXECUTION_PLAN_REGISTRY_INVALID");
  }

  const steps = proposedPlan.steps.map((step, index) => {
    if (!step || typeof step !== "object" || Array.isArray(step)) {
      fail("AFRI_AGENT_EXECUTION_PLAN_STEP_INVALID");
    }
    if (
      typeof step.agentId !== "string" ||
      typeof step.capability !== "string" ||
      typeof step.task !== "string" ||
      !step.task.trim() ||
      step.task.length > 2000
    ) {
      fail("AFRI_AGENT_EXECUTION_PLAN_STEP_FIELDS_INVALID");
    }

    const agent = agents.find(item => item?.id === step.agentId);
    const capability = capabilities.find(item => item?.id === step.capability);

    if (!eligible(agent, capability, requesterAgentId)) {
      fail("AFRI_AGENT_EXECUTION_PLAN_CAPABILITY_NOT_ELIGIBLE");
    }

    const dependencies = step.dependsOn ?? [];
    if (!Array.isArray(dependencies)) {
      fail("AFRI_AGENT_EXECUTION_PLAN_DEPENDENCIES_INVALID");
    }

    const seen = new Set();
    for (const dependency of dependencies) {
      if (
        !Number.isInteger(dependency) ||
        dependency < 1 ||
        dependency >= index + 1 ||
        seen.has(dependency)
      ) {
        fail("AFRI_AGENT_EXECUTION_PLAN_DEPENDENCY_INVALID");
      }
      seen.add(dependency);
    }

    return {
      step: index + 1,
      agentId: agent.id,
      agentName: agent.name,
      capability: capability.id,
      task: step.task.trim(),
      dependsOn: [...dependencies]
    };
  });

  return {
    objective: objective.trim(),
    summary: proposedPlan.summary.trim(),
    steps
  };
}

export default { validate: validateAfriAgentExecutionPlan };
