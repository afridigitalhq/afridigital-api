const eventLog = [];

function scoreEvent(type, status, msg) {
  let score = 0;

  if (status === "error") score += 3;
  if (status === "warn") score += 2;
  if (status === "critical") score += 5;
  if (status === "ok") score += 0;

  if (type === "security") score += 3;
  if (type === "ai") score += 1;
  if (type === "system") score += 1;

  if (msg && msg.toLowerCase().includes("fail")) score += 2;
  if (msg && msg.toLowerCase().includes("attack")) score += 5;

  return score;
}

function classify(score) {
  if (score >= 7) return "CRITICAL";
  if (score >= 4) return "WARNING";
  if (score >= 2) return "INFO";
  return "NORMAL";
}

function emit(type, service, status, msg) {
  const score = scoreEvent(type, status, msg);
  const level = classify(score);

  const event = {
    id: Date.now() + Math.random(),
    ts: new Date().toISOString(),
    type,
    service,
    status,
    msg,
    score,
    level
  };

  const { broadcast } = require("../realtime/ws/stream.bridge");
  try { const { broadcast } = require("../realtime/ws/stream.bridge"); broadcast(event); } catch (e) {}
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
  const critical = eventLog.filter(e => e.level === "CRITICAL").length;
  const warning = eventLog.filter(e => e.level === "WARNING").length;

  return {
    total: eventLog.length,
    critical,
    warning,
    health: critical > 5 ? "DEGRADED" : "STABLE"
  };
}

module.exports = { emit, getEvents, replay, getInsights };
