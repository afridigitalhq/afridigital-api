const { safetyGuard } = require("./safety.guard");

function routeCommand(intent, payload, deps) {
  const guard = safetyGuard(payload);
  if (!guard.allowed) return guard;

  switch (intent) {
    case "SYSTEM_STATUS":
      return deps.state?.getState?.() || { ok: true };

    case "TOPOLOGY_VIEW":
      return deps.topology?.getAttackTopology?.() || {};

    case "EVENT_QUERY":
      return deps.events?.getEvents?.() || [];

    case "WHATSAPP_QUERY":
      return deps.whatsapp?.listInbox?.() || [];

    default:
      return { message: "AfriAI received request", intent };
  }
}

module.exports = { routeCommand };
