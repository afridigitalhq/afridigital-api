module.exports = function collector() {
  return {
    databases: {
      mongo: "UNKNOWN",
      redis: "UNKNOWN",
      postgres: "UNKNOWN",
      dbHealth: 66
    },
    environment: {
      secretsValid: 100,
      envHealth: "PASS",
      missingVars: 0
    },
    security: {
      auth: "PASS",
      risks: 0,
      warnings: 3
    }
  };
};
