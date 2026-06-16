function score(t = {}) {
  const i = t.infra || {};
  const db = t.databases || {};
  const sec = t.security || {};
  const ai = t.ai || {};
  const tel = t.telemetry || {};
  const core = t.core || {};

  const breakdown = {
    infra: 0,
    databases: 0,
    security: 0,
    ai: 0,
    telemetry: 0,
    core: 0
  };

  // INFRA (25)
  breakdown.infra =
    (i.servers?.active > 0 ? 10 : 0) +
    (i.servers?.failed === 0 ? 10 : 0) +
    (i.latency === 0 ? 5 : 0);

  // DATABASES (20)
  breakdown.databases =
    (db.mongo === "ONLINE" ? 7 : 0) +
    (db.redis === "ONLINE" ? 7 : 0) +
    (db.postgres === "ONLINE" ? 6 : (db.postgres === "UNKNOWN" ? 3 : 0));

  // SECURITY (20)
  breakdown.security =
    (sec.authStatus === "PASS" ? 8 : 0) +
    (sec.rateLimits === "ENABLED" ? 6 : 0) +
    Math.max(0, 6 - (sec.warnings || 0));

  // AI (15)
  breakdown.ai =
    (ai.models > 0 ? 5 : 0) +
    (ai.embeddings === "ONLINE" ? 5 : 0) +
    (ai.vectorStore === "ONLINE" ? 5 : 0);

  // TELEMETRY (10)
  breakdown.telemetry =
    3 + 3 +
    (tel.cpu === 0 ? 2 : 0) +
    (tel.disk === 0 ? 2 : 0);

  // CORE (10)
  breakdown.core =
    (core.brain?.status === "ACTIVE" ? 5 : 0) +
    (core.uptime > 0 ? 5 : 0);

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return {
    score: Math.max(0, Math.min(100, Math.round(total))),
    breakdown
  };
}

module.exports = score;
