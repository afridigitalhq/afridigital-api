function collect() {
  return {
    core: {
      uptime: process.uptime(),
      brainStatus: "ACTIVE"
    },

    infra: {
      servers: { total: 1, active: 1, failed: 0 },
      primary: "https://afridigital-api.onrender.com/health",
      frontend: "https://afridigital-hub.onrender.com",
      latency: 0,
      availability: 0,
      infraHealth: 100
    },

    databases: {
      mongo: "UNKNOWN",
      redis: "UNKNOWN",
      postgres: "UNKNOWN",
      collections: 0,
      records: 0,
      storageGB: 0,
      dbHealth: 66
    },

    environment: {
      missingVars: 0,
      secretsValid: 100,
      envHealth: "PASS",
      expiringKeys: 0
    },

    snapshots: {
      total: 0,
      latest: null,
      sizeMB: 0,
      rotation: "ACTIVE",
      recoveryTest: "PASS"
    },

    telemetry: {
      requestsPerMin: 0,
      activeUsers: 0,
      cpu: 0,
      ram: 0,
      disk: 0,
      loadAvg: 0
    },

    meta: {
      status: "UNKNOWN",
      phoneId: "VALID",
      token: "VALID",
      messagesToday: 0,
      failed: 0,
      webhooks: "ACTIVE",
      integrity: 100
    },

    ai: {
      modelsLoaded: 4,
      embeddings: "ONLINE",
      vectorStore: "ONLINE",
      avgResponse: 1.2,
      accuracy: 93
    },

    code: {
      files: 780,
      modules: 511,
      duplicates: 269,
      orphans: 17,
      deadCode: 8,
      circular: 3,
      routes: 124,
      health: 23
    },

    security: {
      auth: "PASS",
      risks: 0,
      warnings: 3,
      audit: "ACTIVE",
      rateLimit: "ENABLED",
      index: 70
    },

    deployments: {
      backend: "ONLINE",
      frontend: "ONLINE",
      build: "2026.06.13",
      lastDeploy: "2h ago",
      failedDeploys: 0
    }
  };
}

module.exports = collect;
