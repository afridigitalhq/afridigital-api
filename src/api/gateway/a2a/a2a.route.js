import AfriA2AGateway from "../../../platform/agent/a2a/AfriA2AGateway.js";
import AfriA2AServiceRegistry from "../../../platform/agent/services/AfriA2AServiceRegistry.js";
import AfriA2ARequestAuth from "../../../platform/agent/security/AfriA2ARequestAuth.js";
import AfriAgentIdentityRegistry from "../../../platform/agent/identity/AfriAgentIdentityRegistry.js";
import AfriAgentCardBuilder from "../../../platform/agent/identity/AfriAgentCardBuilder.js";
import crypto from "node:crypto";
import AfriA2AUsageMeter from "../../../platform/agent/metering/AfriA2AUsageMeter.js";

export default function a2aRoute(app) {
  AfriA2AServiceRegistry.initialize();

  AfriAgentIdentityRegistry.initializeFromEnv();

  app.get("/.well-known/agents/:agentKey/agent-card.json", (req, res) => {
    if (["afridebug", "afriforex", "afriai"].includes(req.params.agentKey)) {
      return res.status(404).json({
        error: {
          code: "AGENT_CARD_NOT_FOUND",
          message: "Agent card not publicly advertised"
        }
      });
    }

    const card = AfriAgentCardBuilder.build(req.params.agentKey);

    if (!card) {
      return res.status(404).json({
        error: {
          code: "AGENT_CARD_NOT_FOUND",
          message: "Unknown agent"
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
    const agents = AfriAgentIdentityRegistry.list()
      .filter((agent) => agent.status === "ACTIVE" && agent.key === "afridebug")
      .map((agent) => ({
        id: agent.id,
        name: agent.name,
        organizationId: agent.organizationId,
        capabilities: agent.capabilities,
        agentCard: "https://raw.githubusercontent.com/afridigitalhq/afridigital-api/main/agent-card.json"
      }));

    return res.json({
      service: "AfriDigital A2A Discovery",
      protocol: "HTTP+JSON",
      agents
    });
  });

  app.get("/api/a2a/telemetry", (req, res) => {

    const agentId = req.get("x-afri-agent-id");
    const timestamp = req.get("x-afri-timestamp");
    const nonce = req.get("x-afri-nonce");
    const signature = req.get("x-afri-signature");

    const auth = AfriA2ARequestAuth.verify({
      agentId,
      timestamp,
      nonce,
      body: {
        query: req.query || {}
      },
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

    const requestedAgentId =
      req.query?.agentId || null;

    const agents =
      AfriAgentIdentityRegistry.list().map(
        agent => ({
          id: agent.id,
          key: agent.key,
          name: agent.name,
          organizationId:
            agent.organizationId,
          stats:
            AfriA2AUsageMeter.stats(
              agent.id
            )
        })
      );

    return res.json({
      service:
        "AfriDigital A2A Telemetry",

      generatedAt:
        Date.now(),

      stats:
        AfriA2AUsageMeter.stats(
          requestedAgentId
        ),

      agents,

      activity:
        AfriA2AUsageMeter
          .list()
          .slice(0, 100)
    });
  });

  app.get("/api/a2a/dashboard-telemetry", (_, res) => {
    const agents =
      AfriAgentIdentityRegistry.list().map(
        agent => ({
          id: agent.id,
          key: agent.key,
          name: agent.name,
          organizationId: agent.organizationId,
          stats: AfriA2AUsageMeter.stats(agent.id)
        })
      );

    return res.json({
      service: "AfriDigital A2A Dashboard Telemetry",
      generatedAt: Date.now(),
      stats: AfriA2AUsageMeter.stats(),
      agents,
      activity: AfriA2AUsageMeter.list().slice(0, 100)
    });
  });

  app.get("/api/a2a/health", (_, res) => {
    res.json({
      service: "AfriDigital A2A",
      status: process.env.A2A_SHARED_SECRET ? "READY" : "NOT_CONFIGURED",
      transport: "HTTP",
      visibility: "MACHINE_ONLY"
    });
  });

  app.post("/message:send", async (req, res) => {
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
      sourceAgentId: agentId
    });

    return res.status(result.ok ? 200 : 400).json(result);
  });
}
