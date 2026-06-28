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
  const event = {
    id: Date.now() + Math.random(),
    ts: new Date().toISOString(),
    type,
    service,
    status,
    msg,
    score: 0
  };

  event.physics = computePhysics(event);

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
