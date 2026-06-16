module.exports = function collect() {
  return {
    core: {
      uptime: process.uptime(),
      brain: { status: "ACTIVE" }
    },

    infra: {
      servers: { total: 1, active: 1, failed: 0 },
      primary: process.env.PRIMARY_API || "https://afridigital-api.onrender.com/health",
      frontend: process.env.FRONTEND_URL || "https://afridigital-hub.onrender.com",
      latency: Number(process.env.LATENCY || 0),
      availability: Number(process.env.AVAILABILITY || 0)
    },

    databases: {
      mongo: process.env.MONGO_STATUS || "UNKNOWN",
      redis: process.env.REDIS_STATUS || "UNKNOWN",
      postgres: process.env.POSTGRES_STATUS || "UNKNOWN"
    },

    meta: {
      status: process.env.META_STATUS || "UNKNOWN",
      phoneId: process.env.META_PHONE_ID || "N/A",
      messagesToday: Number(process.env.META_MESSAGES || 0),
      failed: Number(process.env.META_FAILED || 0),
      webhooks: process.env.META_WEBHOOK_STATUS || "UNKNOWN",
      integrity: Number(process.env.META_INTEGRITY || 0)
    },

    snapshots: {
      total: Number(process.env.SNAPSHOTS_TOTAL || 0),
      latest: process.env.SNAPSHOTS_LATEST || null
    },

    telemetry: {
      cpu: Number(process.env.CPU || 0),
      ram: Number(process.env.RAM || 0),
      requests: Number(process.env.REQUESTS || 0)
    }
  };
};
