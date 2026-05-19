/**
 * 🧠 A3.12 SAFE SELF-EVOLUTION KERNEL
 * Controlled AI self-improvement system (NO uncontrolled rewrites)
 */

const { publish } = require('../event/bus');
const { createEvent } = require('../event/types');

/**
 * RULE ENGINE (NON-NEGOTIABLE SAFETY LAYER)
 */
const rules = {
  allowSelfRewrite: false,
  allowHotPatch: true,
  requireAuditLog: true,
  requireRollback: true,
  maxChangeScope: "MODULE_LEVEL"
};

/**
 * AUDIT TRAIL
 */
const auditLog = [];

/**
 * PROPOSED EVOLUTION ENTRY
 */
function proposeEvolution(change) {
  const proposal = {
    id: "EVOLVE_" + Date.now(),
    change,
    status: "PENDING_AUDIT",
    ts: Date.now()
  };

  auditLog.push(proposal);

  publish(createEvent("EVOLUTION_PROPOSED", proposal));

  return proposal;
}

/**
 * AUDIT ENGINE (DECIDES IF EVOLUTION IS SAFE)
 */
function auditEvolution(proposal) {
  const approved =
    rules.allowHotPatch &&
    proposal.change.scope !== "CORE_KERNEL" &&
    proposal.change.risk !== "HIGH";

  const result = {
    id: proposal.id,
    approved,
    reason: approved ? "SAFE_PATCH_APPROVED" : "BLOCKED_BY_SAFE_KERNEL"
  };

  publish(createEvent("EVOLUTION_AUDIT", result));

  return result;
}

/**
 * APPLY EVOLUTION (ONLY IF AUDITED)
 */
function applyEvolution(proposal, auditResult) {
  if (!auditResult.approved) return false;

  publish(createEvent("EVOLUTION_APPLIED", {
    id: proposal.id,
    applied: true
  }));

  return true;
}

/**
 * SAFE EVOLUTION PIPELINE
 */
function evolve(change) {
  const proposal = proposeEvolution(change);
  const audit = auditEvolution(proposal);
  return applyEvolution(proposal, audit);
}

/**
 * SYSTEM STATUS
 */
function getSafeKernelStatus() {
  return {
    rules,
    pendingAudits: auditLog.filter(a => a.status === "PENDING_AUDIT").length,
    totalProposals: auditLog.length
  };
}

module.exports = {
  evolve,
  auditEvolution,
  proposeEvolution,
  getSafeKernelStatus
};
