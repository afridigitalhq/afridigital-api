// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

// 🧠 SINGLE KERNEL EVENT CONTRACT (SOURCE OF TRUTH)
const EventSpine = {
  emit(event) {
    return {
      id: event.id || Date.now().toString(),
      type: event.type,
      payload: event.payload || {},
      source: event.source || "kernel",
      ts: Date.now()
    };
  }
};

// 🔐 GOVERNANCE LAYER (READ + APPROVAL ONLY)
function governanceFilter(event, context) {
  if (event.type === "DEPLOY_REQUEST" && context.quorum < 2) {
    return { allowed: false, reason: "QUORUM_NOT_MET" };
  }
  return { allowed: true };
}

// 📡 ADAPTER REGISTRY (NO EXECUTION RIGHTS)
const Adapters = {
  whatsapp: (event) => ({ channel: "whatsapp", event }),
  github: (event) => ({ channel: "github", event }),
  ci: (event) => ({ channel: "ci", event }),
  hud: (event) => ({ channel: "hud", event })
};

// 🧠 KERNEL ROUTER (SINGLE PIPELINE)
function route(event, context = { quorum: 0 }) {
  const normalized = EventSpine.emit(event);

  const decision = governanceFilter(normalized, context);
  if (!decision.allowed) {
    return { status: "BLOCKED", decision };
  }

  const adapters = Object.values(Adapters).map(fn => fn(normalized));

  return {
    status: "ROUTED",
    event: normalized,
    adapters
  };
}

module.exports = { route };

