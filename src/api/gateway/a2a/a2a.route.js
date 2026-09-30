import AfriA2AGateway from "../../../platform/agent/a2a/AfriA2AGateway.js";
import AfriA2AServiceRegistry from "../../../platform/agent/services/AfriA2AServiceRegistry.js";
import AfriA2ARequestAuth from "../../../platform/agent/security/AfriA2ARequestAuth.js";
import AfriAgentIdentityRegistry from "../../../platform/agent/identity/AfriAgentIdentityRegistry.js";

export default function a2aRoute(app) {
  AfriA2AServiceRegistry.initialize();

  AfriAgentIdentityRegistry.initializeFromEnv();

  app.get("/api/a2a/health", (_, res) => {
    res.json({
      service: "AfriAI A2A",
      status: process.env.A2A_SHARED_SECRET ? "READY" : "NOT_CONFIGURED",
      transport: "HTTP",
      visibility: "MACHINE_ONLY"
    });
  });

  console.log("A2A_ROUTE_ATTACHED: /api/a2a/health");

  app.post("/api/a2a/tasks", async (req, res) => {
    const agentId = req.get("x-afri-agent-id");
    const timestamp = req.get("x-afri-timestamp");
    const nonce = req.get("x-afri-nonce");
    const signature = req.get("x-afri-signature");

    const auth = AfriA2ARequestAuth.verify({
      agentId,
      timestamp,
      nonce,
      body: req.body || {},
      signature
    });

    if (!auth.verified) {
      return res.status(401).json({
        ok: false,
        error: {
          code: auth.code,
          message: "A2A authentication failed"
        }
      });
    }

    const result = await AfriA2AGateway.handle({
      ...req.body,
      agentId
    });

    return res.status(result.ok ? 200 : 400).json(result);
  });
}
