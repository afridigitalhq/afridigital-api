export default function socRoute(app) {
  app.get("/api/soc", (req, res) => {
    res.json({
      service: "AfriDigital SOC",
      status: "operational",
      timestamp: new Date().toISOString(),

      system: {
        api: "active",
        gateway: "enabled",
        runtime: "express",
        mode: "snapshot"
      },

      render: {
        endpoint: "https://afridigital-api.onrender.com",
        region: "production"
      },

      services: {
        AfriVision: {
          status: "mock-ready",
          type: "security"
        },
        AfriSports: {
          status: "mock-ready",
          type: "engagement"
        },
        AfriMetaWorld: {
          status: "mock-ready",
          type: "simulation"
        }
      },

      legacy: {
        detected: true,
        note: "legacy system still active under africore runtime"
      }
    });
  });
}
