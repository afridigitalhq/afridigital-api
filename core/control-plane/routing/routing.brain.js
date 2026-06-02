const bus = require("../controlBus");
const { saveSnapshot } = require("../snapshot.engine");

const state = {
  mode: "SAFE", // SAFE | SANDBOX | AUTONOMOUS
  routes: {},   // eventType -> [{ target, weight, stats }]
};

/**
 * Initialize routing brain with known routes
 */
function registerRoute(eventType, target, initialWeight = 0.5) {
  if (!state.routes[eventType]) state.routes[eventType] = [];

  state.routes[eventType].push({
    target,
    weight: initialWeight,
    latency: 0,
    success: 0,
    fail: 0
  });
}

/**
 * Score-based router
 */
function pickRoute(eventType) {
  const candidates = state.routes[eventType] || [];

  if (candidates.length === 0) return null;

  const scored = candidates.map(r => {
    const performance = (r.success + 1) / (r.fail + 1);
    const score = r.weight * performance - (r.latency * 0.01);
    return { ...r, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored[0];
}

/**
 * Emit routing decision to control plane + flow graph
 */
function emitRouteDecision(traceId, eventType, route) {
  bus.emitEvent({
    type: "ROUTE_DECISION",
    stage: "selected",
    traceId,
    payload: {
      eventType,
      target: route?.target,
      weight: route?.weight
    }
  });
}

/**
 * MAIN ROUTING FUNCTION (used by system)
 */
function routeEvent(eventType, payload, traceId = "no-trace") {
  const route = pickRoute(eventType);

  emitRouteDecision(traceId, eventType, route);

  if (!route) {
    bus.emitEvent({
      type: "ROUTE_MISS",
      stage: "fallback",
      traceId,
      payload: { eventType }
    });
    return null;
  }

  return route.target;
}

/**
 * Learning loop (feedback signal)
 */
function feedback(eventType, target, success, latency = 0) {
  const routes = state.routes[eventType] || [];
  const route = routes.find(r => r.target === target);

  if (!route) return;

  route.latency = latency;

  if (success) route.success++;
  else route.fail++;

  // adaptive weight update (bounded learning)
  const delta = success ? 0.02 : -0.03;
  route.weight = Math.max(0.05, Math.min(1, route.weight + delta));

  // snapshot only on meaningful change
  saveSnapshot({
    type: "ROUTING_UPDATE",
    eventType,
    target,
    weight: route.weight,
    success,
    latency
  });

  bus.emitEvent({
    type: "ROUTE_LEARN",
    stage: "updated",
    traceId: "system",
    payload: { eventType, target, weight: route.weight }
  });
}

/**
 * Mode switch (SAFE / SANDBOX / AUTONOMOUS)
 */
function setMode(mode) {
  state.mode = mode;

  saveSnapshot({
    type: "ROUTING_MODE_CHANGE",
    mode
  });

  bus.emitEvent({
    type: "ROUTING_MODE",
    stage: "update",
    traceId: "system",
    payload: { mode }
  });
}

module.exports = {
  registerRoute,
  routeEvent,
  feedback,
  setMode,
  state
};
