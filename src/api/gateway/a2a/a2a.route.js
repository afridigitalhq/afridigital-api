import AfriA2AGateway from "../../../platform/agent/a2a/AfriA2AGateway.js";
import AfriA2AServiceRegistry from "../../../platform/agent/services/AfriA2AServiceRegistry.js";
import AfriA2ARequestAuth from "../../../platform/agent/security/AfriA2ARequestAuth.js";
import AfriAgentIdentityRegistry from "../../../platform/agent/identity/AfriAgentIdentityRegistry.js";
import AfriAgentProfiles from "../../../platform/agent/identity/AfriAgentProfiles.js";
import AfriAgentCardBuilder from "../../../platform/agent/identity/AfriAgentCardBuilder.js";
import crypto from "node:crypto";
import AfriA2AUsageMeter from "../../../platform/agent/metering/AfriA2AUsageMeter.js";

const BASE_URL =
  process.env.A2A_PUBLIC_BASE_URL ||
  "https://afridigital-api.onrender.com";

const PUBLIC_AGENT_PROFILE_IDS = Object.freeze(
  Object.fromEntries(
    ["afriai", "afridebug", "afrirea", "afriforex"].map(key => [key, AfriAgentProfiles[key]?.id || null])
  )
);

export default function a2aRoute(app, {
  requestAuth = AfriA2ARequestAuth,
  authorizeTelemetryAdmin = async () => false,
  agentCardBuilder = AfriAgentCardBuilder,
  identityRegistry = AfriAgentIdentityRegistry
} = {}) {
  AfriA2AServiceRegistry.initialize();

  identityRegistry.initializeFromEnv();

  app.get("/.well-known/agents/:agentKey/agent-card.json", (req, res) => {
    const agentKey = req.params.agentKey;
    const expectedProfileId = PUBLIC_AGENT_PROFILE_IDS[agentKey];
    const identity = expectedProfileId
      ? identityRegistry.get(expectedProfileId)
      : null;

    if (
      !identity ||
      identity.status !== "ACTIVE" ||
      identity.id !== expectedProfileId ||
      identity.key !== agentKey
    ) {
      return res.status(404).json({
        error: {
          code: "AGENT_CARD_NOT_FOUND",
          message: "Agent card not publicly advertised"
        }
      });
    }

    const card = agentCardBuilder.build(agentKey);

    if (!card) {
      return res.status(404).json({
        error: {
          code: "AGENT_CARD_NOT_FOUND",
          message: "Agent card not publicly advertised"
        }
      });
    }

    res.set("Cache-Control", "public, max-age=300");
    return res.json(card);
  });

  app.get("/.well-known/agent-card.json", (_, res) => {
    return res.status(404).json({
      error: {
        code: "AGENT_CARD_NOT_FOUND",
        message: "Agent card not publicly advertised"
      }
    });
  });

  app.get("/api/a2a/agents", (_, res) => {
    const agents = identityRegistry.list()
      .filter((agent) =>
        agent.status === "ACTIVE" &&
        Object.hasOwn(PUBLIC_AGENT_PROFILE_IDS, agent.key) &&
        agent.id === PUBLIC_AGENT_PROFILE_IDS[agent.key]
      )
      .map((agent) => ({
        id: agent.id,
        key: agent.key,
        name: agent.name,
        organizationId: agent.organizationId,
        capabilities: agent.capabilities,
        agentCard: `${BASE_URL}/.well-known/agents/${agent.key}/agent-card.json`
      }));

    return res.json({
      service: "AfriDigital A2A Discovery",
      protocol: "HTTP+JSON",
      agents
    });
  });

  app.get("/api/a2a/telemetry", async (req, res) => {
    let authorized = false;
    try {
      authorized = await authorizeTelemetryAdmin(req) === true;
    } catch {
      authorized = false;
    }

    if (!authorized) {
      return res.status(403).json({
        ok: false,
        error: {
          code: "ADMIN_TELEMETRY_FORBIDDEN",
          message: "Administrator authorization required"
        }
      });
    }

    const requestedAgentId = req.query?.agentId || null;
    const agents = identityRegistry.list().map(agent => ({
      id: agent.id,
      key: agent.key,
      name: agent.name,
      organizationId: agent.organizationId,
      stats: AfriA2AUsageMeter.stats(agent.id)
    }));

    return res.json({
      service: "AfriDigital A2A Telemetry",
      generatedAt: Date.now(),
      stats: AfriA2AUsageMeter.stats(requestedAgentId),
      agents,
      activity: AfriA2AUsageMeter.list().slice(0, 100)
    });
  });

  app.get("/api/a2a/dashboard-telemetry", (_, res) => {
    const totals = AfriA2AUsageMeter.stats();

    return res.json({
      service: "AfriDigital A2A Dashboard Telemetry",
      generatedAt: Date.now(),
      stats: {
        operations: totals.operations,
        a2aCalls: totals.a2aCalls,
        processing: totals.processing,
        completed: totals.completed,
        failed: totals.failed,
        successful: totals.successful
      }
    });
  });

  app.get("/api/a2a/health", async (_, res) => {
    res.json({
      service: "AfriDigital A2A",
      status: (await requestAuth.isReady()) ? "READY" : "NOT_CONFIGURED",
      transport: "HTTP",
      visibility: "MACHINE_ONLY"
    });
  });

  app.post("/message:send", async (req, res) => {
    const agentId = req.get("x-afri-agent-id");
    const timestamp = req.get("x-afri-timestamp");
    const nonce = req.get("x-afri-nonce");
    const signature = req.get("x-afri-signature");

    const auth = await requestAuth.verify({
      agentId,
      timestamp,
      nonce,
      method: "POST",
      path: "/message:send",
      body: req.body || {},
      signature
    });

    if (!auth.verified) {
      return res.status(auth.code === "A2A_REPLAY_PROTECTION_UNAVAILABLE" ? 503 : 401).json({
        error: {
          code: auth.code,
          message: "A2A authentication failed"
        }
      });
    }

    const message = req.body?.message || {};
    const textPart = (message.parts || []).find(part => part?.text)?.text;

    if (!textPart) {
      return res.status(400).json({
        error: {
          code: "INVALID_REQUEST",
          message: "message.parts must contain a text part"
        }
      });
    }

    const result = await AfriA2AGateway.handle({
      taskId: message.taskId || message.messageId || undefined,
      agentId,
      sourceAgentId: agentId,
      requestOrigin: "EXTERNAL",
      capability: req.body?.metadata?.capability || "afriai.ask",
      payload: {
        message: textPart,
        context: req.body?.metadata?.context || {}
      }
    });

    if (!result.ok) {
      return res.status(400).json({
        error: {
          code: result.error?.code || "A2A_ERROR",
          message: result.error?.message || "A2A request failed"
        }
      });
    }

    return res.type("application/a2a+json").json({
      message: {
        messageId: message.messageId || crypto.randomUUID(),
        role: "ROLE_AGENT",
        parts: [
          {
            text: result.result?.response || result.result?.agent?.result?.response || ""
          }
        ]
      }
    });
  });

  app.post("/api/a2a/tasks", async (req, res) => {
    const agentId = req.get("x-afri-agent-id");
    const timestamp = req.get("x-afri-timestamp");
    const nonce = req.get("x-afri-nonce");
    const signature = req.get("x-afri-signature");

    const auth = await requestAuth.verify({
      agentId,
      timestamp,
      nonce,
      method: "POST",
      path: "/api/a2a/tasks",
      body: req.body || {},
      signature
    });

    if (!auth.verified) {
      return res.status(auth.code === "A2A_REPLAY_PROTECTION_UNAVAILABLE" ? 503 : 401).json({
        ok: false,
        error: {
          code: auth.code,
          message: "A2A authentication failed"
        }
      });
    }

    const result = await AfriA2AGateway.handle({
      ...req.body,
      sourceAgentId: agentId,
      requestOrigin: "EXTERNAL"
    });

    return res.status(result.ok ? 200 : 400).json(result);
  });
}
