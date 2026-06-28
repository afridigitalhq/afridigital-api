const eventLog = [];

function computePhysics(e) {
  const score = e.score || 0;

  return {
    heat: score * 10,
    velocity: e.status === "critical" ? 3 : 1,
    mass: 1 + score
  };
}

function emit(type, service, status, msg) {
  const clusterKey = service;
  const origin = type === "security" ? "suspected_root" : "unknown";
  const event = {
    id: Date.now() + Math.random(),
    ts: new Date().toISOString(),
    type,
    service,
    status,
    msg,
    score: 0
  };

  const heat = (status === "critical" ? 10 : status === "warn" ? 5 : 1);
  const decay = 0.95;

  event.physics = { heat, velocity: status === "critical" ? 3 : 1, mass: 1 };
  event.cluster = clusterKey;
  event.origin = origin;
  event.heat = heat;
  event.decay = decay;

  eventLog.push(event);
  if (eventLog.length > 500) eventLog.shift();

  return event;
}
  const clusterKey = service;
  const origin = type === "security" ? "suspected_root" : "unknown";
  const heat = (status === "critical" ? 10 : status === "warn" ? 5 : 1) * (1 + (eventLog.length % 5));
  const decay = 0.95;
  const event = {
  // 🧠 CLUSTER + CAUSAL + HEAT METADATA
  const clusterKey = service;
  const origin = type === "security" ? "suspected_root" : "unknown";
  const heat = (status === "critical" ? 10 : status === "warn" ? 5 : 1) * (1 + (eventLog.length % 5));
  const decay = 0.95;
    id: Date.now() + Math.random(),
    ts: new Date().toISOString(),
    type,
    service,
    status,
    msg,
    score: 0
  event.physics = computePhysics(event);
  event.cluster = clusterKey;
  event.origin = origin;
  event.heat = heat;
  event.decay = decay;
  eventLog.push(event);
  if (eventLog.length > 500) eventLog.shift();
  return event;

  event.physics = computePhysics(event);

  event.cluster = clusterKey;
  event.origin = origin;
  event.heat = heat;
  event.decay = decay;
  eventLog.push(event);
  eventLog.push(event);

  if (eventLog.length > 500) eventLog.shift();

  return event;
}

function getEvents(limit = 100) {
  return eventLog.slice(-limit);
}

function replay(from = 0, to = eventLog.length) {
  return eventLog.slice(from, to);
}

function getInsights() {
  const critical = eventLog.filter(e => e.status === "critical").length;
  const warning = eventLog.filter(e => e.status === "warn").length;

  return {
    total: eventLog.length,
    critical,
    warning,
    health: critical > 5 ? "DEGRADED" : "STABLE"
  };
}

module.exports = {
  emit,
  getEvents,
  replay,
  getInsights
};
