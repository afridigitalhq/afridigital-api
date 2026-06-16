module.exports = function pipeline() {
  return {
    state: "DEGRADED",
    score: 71,
    uptime: process.uptime(),
    infra: {
      servers: { active: 1, total: 1 },
      primary: "https://afridigital-api.onrender.com/health",
      frontend: "https://afridigital-hub.onrender.com",
      latency: 0,
      availability: 0
    }
  };
};
