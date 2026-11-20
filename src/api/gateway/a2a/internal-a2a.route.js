import express from "express";
import AfriInternalA2ARequestAuth from "../../../platform/agent/security/AfriInternalA2ARequestAuth.js";
import AfriAgentProfiles from "../../../platform/agent/identity/AfriAgentProfiles.js";
import AfriAgentHarnessRuntime from "../../../platform/agent/harness/runtime/AfriAgentHarnessRuntime.js";

const PATH = "/api/a2a/internal/tasks";
const SOURCE_AGENT_ID = AfriAgentProfiles.afriaicommand.id;
const TARGET_AGENT_ID = AfriAgentProfiles.afriaicoder.id;
const SOURCE_CAPABILITY_ID = "afriaicommand.execute";
const TARGET_CAPABILITY_ID = "engineering.backend";
const MAX_BYTES = 65536;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function safeCode(error) {
  const code = error?.code || error?.message;
  return typeof code === "string" && /^[A-Z0-9_:-]{1,100}$/.test(code)
    ? code
    : "AFRI_INTERNAL_A2A_EXECUTION_FAILED";
}

export default function internalA2ARoute(app, {
  requestAuth = AfriInternalA2ARequestAuth,
  harnessRuntime = AfriAgentHarnessRuntime
} = {}) {
  if (!app || typeof app.post !== "function") {
    throw new Error("AFRI_INTERNAL_A2A_ROUTE_APP_INVALID");
  }
  if (!requestAuth || typeof requestAuth.verify !== "function" ||
      typeof requestAuth.isReady !== "function" ||
      !harnessRuntime || typeof harnessRuntime.createInternalExecutor !== "function") {
    throw new Error("AFRI_INTERNAL_A2A_ROUTE_DEPENDENCY_INVALID");
  }

  const executeInternal = harnessRuntime.createInternalExecutor({
    sourceAgentId: SOURCE_AGENT_ID,
    sourceCapabilityId: SOURCE_CAPABILITY_ID
  });

  app.post(PATH, express.raw({
    type: "application/json",
    limit: "64kb"
  }), async (req, res) => {
    if (!Buffer.isBuffer(req.body) ||
        req.body.length === 0 ||
        req.body.length > MAX_BYTES) {
      return res.status(400).json({
        ok: false,
        error: { code: "AFRI_INTERNAL_A2A_BODY_INVALID" }
      });
    }

    let body;
    try {
      body = JSON.parse(req.body.toString("utf8"));
    } catch {
      return res.status(400).json({
        ok: false,
        error: { code: "AFRI_INTERNAL_A2A_JSON_INVALID" }
      });
    }

    if (!isRecord(body) ||
        body.agentId !== TARGET_AGENT_ID ||
        !isRecord(body.task) ||
        body.task.capability !== TARGET_CAPABILITY_ID ||
        !isRecord(body.task.payload) ||
        typeof body.task.payload.objective !== "string" ||
        !body.task.payload.objective.trim() ||
        body.task.payload.objective.length > 2000 ||
        !Array.isArray(body.task.payload.dependencyResults) ||
        body.task.payload.dependencyResults.length > 12 ||
        !isRecord(body.context)) {
      return res.status(400).json({
        ok: false,
        error: { code: "AFRI_INTERNAL_A2A_TASK_INVALID" }
      });
    }

    let authReady;
      try {
        authReady = await requestAuth.isReady();
      } catch {
        return res.status(503).json({
          ok: false,
          error: { code: "AFRI_INTERNAL_A2A_AUTH_READINESS_UNAVAILABLE" }
        });
      }
      if (!authReady) {
        return res.status(503).json({
          ok: false,
          error: { code: "AFRI_INTERNAL_A2A_AUTH_NOT_READY" }
        });
      }

      let auth;
      try {
        auth = await requestAuth.verify({
      method: "POST",
      path: PATH,
      agentId: req.get("x-afri-agent-id"),
      timestamp: req.get("x-afri-timestamp"),
      nonce: req.get("x-afri-nonce"),
      signature: req.get("x-afri-signature"),
          body
        });
      } catch {
        return res.status(503).json({
          ok: false,
          error: { code: "AFRI_INTERNAL_A2A_AUTH_VERIFICATION_UNAVAILABLE" }
        });
      }

    if (!auth || auth.verified !== true || auth.agent?.id !== SOURCE_AGENT_ID) {
      const authCode = auth?.code;
      const unavailable = authCode === "A2A_REPLAY_PROTECTION_UNAVAILABLE";
      return res.status(unavailable ? 503 : 401).json({
        ok: false,
        error: { code: authCode || "A2A_INTERNAL_AUTH_FAILED" }
      });
    }

    const context = {};
    for (const key of [
      "taskId", "requestId", "planObjective", "planSummary", "step", "dependsOn"
    ]) {
      if (Object.hasOwn(body.context, key)) context[key] = body.context[key];
    }

    try {
      const result = await executeInternal({
        agentId: TARGET_AGENT_ID,
        task: {
          capability: TARGET_CAPABILITY_ID,
          payload: body.task.payload
        },
        context
      });

      let serialized;
      try {
        serialized = JSON.stringify(result === undefined ? null : result);
      } catch {
        throw new Error("AFRI_INTERNAL_A2A_RESULT_NOT_SERIALIZABLE");
      }
      if (Buffer.byteLength(serialized, "utf8") > MAX_BYTES) {
        throw new Error("AFRI_INTERNAL_A2A_RESULT_TOO_LARGE");
      }

      return res.status(200).json({
        ok: true,
        result: JSON.parse(serialized)
      });
    } catch (error) {
      const code = safeCode(error);
      const status = code.includes("UNAVAILABLE") ? 503 : 400;
      return res.status(status).json({
        ok: false,
        error: { code }
      });
    }
  });
}
