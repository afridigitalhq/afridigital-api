import express from "express";
import { createAfriIdentityAuthenticationMiddleware } from "../../../afriidentity/middleware/AfriIdentityAuthenticationMiddleware.js";
import { getAfriAgentApprovalRuntime } from "../../../platform/agent/harness/approval/AfriAgentApprovalRuntime.js";
import { validateAfriAICommandPlan } from "../../../platform/agent/command/AfriAICommandPlanner.js";
import AfriAgentIdentityRegistry from "../../../platform/agent/identity/AfriAgentIdentityRegistry.js";
import AfriAgentCapabilityRegistry from "../../../platform/agent/registry/AfriAgentCapabilityRegistry.js";

const SOURCE_AGENT_ID = "AGENT-AFRIAICOMMAND-001";
const BASE_PATH = "/api/a2a/internal/approvals";
const jsonBody = express.json({ limit: "64kb", strict: true });

function sendError(res, error) {
  const code = typeof error?.code === "string" ? error.code
    : typeof error?.message === "string" && /^[A-Z0-9_:-]{1,100}$/.test(error.message)
      ? error.message : "AFRI_APPROVAL_REQUEST_FAILED";
  const status = code.includes("NOT_INITIALIZED") || code.includes("UNAVAILABLE") ||
    code.includes("POSTGRES") || code.includes("IDENTITY_SERVICE")
      ? 503
      : code.includes("FORBIDDEN") || code.includes("SEPARATION_OF_DUTIES") ? 403
      : code.includes("NOT_FOUND") ? 404
      : code.includes("NOT_PENDING") || code.includes("EXPIRED") ||
        code.includes("ALREADY_CONSUMED") ? 409 : 400;
  return res.status(status).json({ error: { code } });
}

function requireApprovalIdentity(req, res, next, getRuntime) {
  let runtime;
  try {
    runtime = getRuntime();
  } catch {
    return res.status(503).json({ error: { code: "AFRI_AGENT_APPROVAL_RUNTIME_NOT_INITIALIZED" } });
  }

  let middleware;
  try {
    middleware = createAfriIdentityAuthenticationMiddleware({
      sessionService: runtime.sessionService
    });
  } catch {
    return res.status(503).json({ error: { code: "AFRI_IDENTITY_AUTHENTICATION_UNAVAILABLE" } });
  }

  return middleware(req, res, () => {
    Promise.resolve(runtime.sessionService.verifyPrincipal(req.auth))
      .then(principal => {
        if (!principal) {
          res.status(401).json({ error: { code: "AFRI_IDENTITY_PRINCIPAL_INVALID" } });
          return;
        }
        req.approvalRuntime = runtime;
        req.approvalPrincipal = principal;
        return next();
      })
      .catch(() => {
        res.status(503).json({ error: { code: "AFRI_IDENTITY_VERIFICATION_UNAVAILABLE" } });
      });
  });
}

function normalizeSubmittedPlan(body) {
  const input = body?.plan;
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("AFRI_APPROVAL_PLAN_REQUIRED");
  }
  return validateAfriAICommandPlan({
    objective: input.objective,
    proposedPlan: {
      summary: input.summary,
      steps: input.steps
    },
    agents: AfriAgentIdentityRegistry.list(),
    capabilities: AfriAgentCapabilityRegistry.list(),
    requesterAgentId: SOURCE_AGENT_ID
  });
}

function validApprovalId(value) {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

const handle = callback => (req, res) => {
  Promise.resolve(callback(req, res)).catch(error => sendError(res, error));
};

export default function internalApprovalRoute(app, { getRuntime = getAfriAgentApprovalRuntime } = {}) {
  const requireIdentity = (req, res, next) => requireApprovalIdentity(req, res, next, getRuntime);
  app.post(BASE_PATH, jsonBody, requireIdentity, handle(async (req, res) => {
    const plan = normalizeSubmittedPlan(req.body);
    const approval = await req.approvalRuntime.authority.request({
      sourceAgentId: SOURCE_AGENT_ID,
      requestedBy: req.approvalPrincipal.userId,
      plan
    });
    return res.status(201).json({ approval, plan });
  }));

  app.post(BASE_PATH + "/:approvalId/approve", jsonBody, requireIdentity, handle(async (req, res) => {
    if (!validApprovalId(req.params.approvalId)) throw new Error("AFRI_APPROVAL_ID_INVALID");
    const approval = await req.approvalRuntime.authority.approve({
      approvalId: req.params.approvalId,
      approverId: req.approvalPrincipal.userId,
      principal: req.approvalPrincipal
    });
    return res.json({ approval });
  }));

  app.post(BASE_PATH + "/:approvalId/reject", jsonBody, requireIdentity, handle(async (req, res) => {
    if (!validApprovalId(req.params.approvalId)) throw new Error("AFRI_APPROVAL_ID_INVALID");
    const reason = req.body?.reason ?? null;
    if (reason !== null && (typeof reason !== "string" || reason.length > 500)) {
      throw new Error("AFRI_APPROVAL_REJECTION_REASON_INVALID");
    }
    const approval = await req.approvalRuntime.authority.reject({
      approvalId: req.params.approvalId,
      approverId: req.approvalPrincipal.userId,
      principal: req.approvalPrincipal,
      reason
    });
    return res.json({ approval });
  }));

  app.post(BASE_PATH + "/:approvalId/execute", jsonBody, requireIdentity, handle(async (req, res) => {
    if (!validApprovalId(req.params.approvalId)) throw new Error("AFRI_APPROVAL_ID_INVALID");
    const plan = normalizeSubmittedPlan(req.body);
    const result = await req.approvalRuntime.commandRuntime.executeApproved({
      approvalId: req.params.approvalId,
      requesterId: req.approvalPrincipal.userId,
      plan,
      context: { requestId: req.params.approvalId }
    });
    return res.json({ result });
  }));
}
