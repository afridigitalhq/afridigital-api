function resolveConflicts(decisions) {
  // priority order
  const rank = {
    DROP: 4,
    SYSTEM: 4,
    PRIORITY: 3,
    NORMAL: 2,
    DELAY: 1
  };

  let final = decisions[0];

  for (const d of decisions) {
    if (!d) continue;

    if ((rank[d.action] || 0) > (rank[final.action] || 0)) {
      final = d;
    }
  }

  return final;
}

function escalate(memory, decision) {
  if (memory.flags?.includes("repeat_offender")) {
    return { ...decision, action: "DROP", reason: "memory_escalation" };
  }

  if (memory.score > 5 && decision.action === "NORMAL") {
    return { ...decision, action: "PRIORITY", reason: "trusted_user_boost" };
  }

  return decision;
}

function coordinate(agentResults, memoryMap) {
  const enriched = agentResults.map(r => {
    const mem = memoryMap[r.agent] || { score: 0, flags: [] };
    return escalate(mem, r);
  });

  return resolveConflicts(enriched);
}

module.exports = { coordinate };
