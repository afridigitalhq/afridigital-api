import { getAfriAgentPlatformReadiness } from "../../platform/agent/readiness/AfriAgentPlatformReadiness.js";
export default function agentPlatformReadinessRoute(app, getReadiness = getAfriAgentPlatformReadiness) {
  app.get("/api/agent-platform/readiness", async (_req, res) => {
    try {
      const readiness = await getReadiness();
      return res.status(readiness.ready === true ? 200 : 503).json(readiness);
    } catch {
      return res.status(503).json({ status: "NOT_READY", ready: false, checks: { database: false, identity: false, approval: false, command: false }, timestamp: new Date().toISOString() });
    }
  });
}