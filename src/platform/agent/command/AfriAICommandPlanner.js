import { validateAfriAgentExecutionPlan } from "../harness/orchestration/AfriAgentExecutionPlan.js";

function tokenize(value) {
  return String(value || "").toLowerCase().match(/[a-z0-9]+/g) || [];
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

function scoreCapability(objective, agent, capability) {
  const terms = new Set(tokenize(objective));
  const metadata = [
    capability.id, capability.service, capability.description,
    agent.name, agent.key
  ].join(" ");
  const matches = [...new Set(tokenize(metadata))]
    .filter(term => terms.has(term) && term.length > 2);
  return { score: matches.length, matches };
}

export function buildAfriAICommandPlan({
  objective, agents = [], capabilities = [],
  requesterAgentId = "AGENT-AFRIAICOMMAND-001"
} = {}) {
  if (typeof objective !== "string" || !objective.trim()) {
    throw new Error("AFRIAICOMMAND_OBJECTIVE_REQUIRED");
  }

  const candidates = [];
  for (const agent of agents) {
    for (const capabilityId of agent?.capabilities || []) {
      const capability = capabilities.find(item => item.id === capabilityId);
      if (!eligible(agent, capability, requesterAgentId)) continue;
      const result = scoreCapability(objective, agent, capability);
      if (result.score > 0) {
        candidates.push({
          agentId: agent.id,
          agentName: agent.name,
          capability: capability.id,
          score: result.score,
          matchedTerms: result.matches
        });
      }
    }
  }

  candidates.sort((a, b) =>
    b.score - a.score ||
    a.agentId.localeCompare(b.agentId) ||
    a.capability.localeCompare(b.capability)
  );

  return {
    service: "AfriAICommand",
    status: "PREVIEW",
    planningMode: "HEURISTIC_FALLBACK",
    objective: objective.trim(),
    executionChannel: "INTERNAL_ADMIN",
    paymentPolicy: "NO_AUTOMATIC_PAYMENT",
    executionStarted: false,
    requiresApprovalBeforeDelegation: true,
    steps: candidates.length
      ? [{ step: 1, action: "DELEGATION_CANDIDATE", status: "NOT_STARTED", candidates }]
      : [],
    candidateCount: candidates.length,
    message: candidates.length
      ? "Heuristic candidate preview only. No agent has been invoked."
      : "No eligible registered capability matched this objective."
  };
}

function blocked(objective, code, provider = null) {
  return {
    service: "AfriAICommand",
    status: "BLOCKED",
    planningMode: "AI_STRUCTURED",
    objective,
    provider,
    error: code,
    executionChannel: "INTERNAL_ADMIN",
    paymentPolicy: "NO_AUTOMATIC_PAYMENT",
    executionStarted: false,
    requiresApprovalBeforeDelegation: false,
    steps: [],
    message: "AI planning did not produce a validated executable proposal. No agent was invoked."
  };
}

export function validateAfriAICommandPlan(input = {}) {
  const validated = validateAfriAgentExecutionPlan({
    ...input,
    requesterAgentId: input.requesterAgentId || "AGENT-AFRIAICOMMAND-001"
  });
  return {
    service: "AfriAICommand",
    status: "PREVIEW",
    planningMode: "AI_STRUCTURED",
    ...validated,
    executionChannel: "INTERNAL_ADMIN",
    paymentPolicy: "NO_AUTOMATIC_PAYMENT",
    executionStarted: false,
    requiresApprovalBeforeDelegation: true,
    message: "AI plan validated against the live registries. Independent trusted approval is required before delegation. Execution has not started."
  };
}

export async function buildAfriAICommandPlanWithAI({
  objective, agents = [], capabilities = [],
  requesterAgentId = "AGENT-AFRIAICOMMAND-001", reasoner
} = {}) {
  if (typeof objective !== "string" || !objective.trim()) {
    throw new Error("AFRIAICOMMAND_OBJECTIVE_REQUIRED");
  }
  if (typeof reasoner !== "function") {
    return blocked(objective.trim(), "AFRIAICOMMAND_REASONER_UNAVAILABLE");
  }

  const eligibleAgents = agents
    .filter(agent => agent && agent.id !== requesterAgentId && agent.status === "ACTIVE")
    .map(agent => ({
      id: agent.id,
      name: agent.name,
      capabilities: (agent.capabilities || []).filter(id => {
        const capability = capabilities.find(item => item.id === id);
        return eligible(agent, capability, requesterAgentId);
      })
    }))
    .filter(agent => agent.capabilities.length);

  if (!eligibleAgents.length) {
    return blocked(objective.trim(), "AFRIAICOMMAND_NO_ELIGIBLE_CAPABILITIES");
  }

  const eligibleCapabilities = capabilities
    .filter(capability => eligibleAgents.some(agent =>
      agent.capabilities.includes(capability.id)
    ))
    .map(({ id, service, description }) => ({ id, service, description }));

  const prompt = [
    "You are the structured task planner for AfriAICommand Agent.",
    "Return ONLY valid JSON. No Markdown or code fences.",
    'Required schema: {"summary":"...","steps":[{"agentId":"...","capability":"...","task":"...","dependsOn":[]}]}',
    "Use only the exact agent IDs and capability IDs supplied below.",
    "Use only capabilities assigned to the selected agent.",
    "Do not invent agents, capabilities, tools or permissions.",
    "Do not propose privileged or admin-only capabilities.",
    "Create between 1 and 12 useful steps.",
    "Each dependency must refer to an earlier step number.",
    "This is an unapproved proposal. Never claim it is authorized or execute it without independent trusted approval.",
    "OBJECTIVE:",
    objective.trim(),
    "ELIGIBLE AGENTS:",
    JSON.stringify(eligibleAgents),
    "ELIGIBLE CAPABILITIES:",
    JSON.stringify(eligibleCapabilities)
  ].join("\n");

  let result;
  try {
    result = await reasoner(prompt);
  } catch {
    return blocked(objective.trim(), "AFRIAICOMMAND_REASONER_FAILED");
  }

  if (!result?.ok || typeof result.content !== "string" || !result.content.trim()) {
    return blocked(objective.trim(), result?.code || "AFRIAICOMMAND_REASONER_EMPTY", result?.provider || null);
  }

  let proposed;
  try {
    const content = result.content.trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");
    proposed = JSON.parse(content);
  } catch {
    return blocked(objective.trim(), "AFRIAICOMMAND_PLAN_JSON_INVALID", result.provider || null);
  }

  try {
    const validated = validateAfriAICommandPlan({
      objective, proposedPlan: proposed, agents, capabilities, requesterAgentId
    });
    return { ...validated, provider: result.provider || "ollama" };
  } catch (error) {
    return blocked(objective.trim(), error.message || "AFRIAICOMMAND_PLAN_VALIDATION_FAILED", result.provider || null);
  }
}

const AfriAICommandPlanner = {
  plan(input = {}) {
    return buildAfriAICommandPlan(input);
  },
  planWithAI(input = {}) {
    return buildAfriAICommandPlanWithAI(input);
  }
};

export default AfriAICommandPlanner;
