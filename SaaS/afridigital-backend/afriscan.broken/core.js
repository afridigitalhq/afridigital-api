function collector() {
  return {
    score: 52,
    state: "DEGRADED",
    uptime: Math.random(),
    infra: {
      servers: { total: 1, active: 1, failed: 0 },
      primary: "https://afridigital-api.onrender.com/health",
      frontend: "https://afridigital-hub.onrender.com",
      latency: 0,
      availability: 0
    },
    db: { mongo: "UNKNOWN", redis: "UNKNOWN", postgres: "UNKNOWN" },
    meta: {
      status: "UNKNOWN",
      phoneId: "N/A",
      messagesToday: 0,
      failed: 0,
      webhooks: "UNKNOWN",
      integrity: 0
    },
    snapshots: { total: 0, latest: null },
    telemetry: { cpu: 0, ram: 0, requests: 0 }
  };
}

function score() {
  return {
    score: 12,
    breakdown: {
      infra: 0,
      databases: 0,
      security: 6,
      ai: 0,
      telemetry: 6,
      core: 0
    }
  };
}

function state() {
  return collector().state;
}

module.exports = { pipeline, score, state };
