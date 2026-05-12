const FinanceControl = require("../safety/finance.control");
const Fraud = require("../fraud/fraud.engine");
const Audit = require("../audit/ledger.audit");

const { check } = require("../safety/idempotency.engine");
const { assertLedgerOnly } = require("../safety/finance.policy");
const FinanceControl = require("../safety/finance.control");

function processTransaction(tx) {
  const fraud = Fraud.analyze(tx);
  const freezeStatus = FinanceControl.autoFreezeIfNeeded(fraud);
  tx._freezeStatus = freezeStatus;
  if (fraud.flagged) {
    tx._flag = fraud;
  }
  const audited = Audit.logTransaction(tx);
  return { ...tx, audit: audited.hash };

  // ❄️ GLOBAL FREEZE CHECK
  if (FinanceControl.isFrozen && FinanceControl.isFrozen()) {
    throw new Error("🚨 FINANCIAL SYSTEM FROZEN BY ADMIN");
  }

  // 🧾 Idempotency protection
  if (check(tx.id, tx.userId, tx.type)) {
    return "DUPLICATE_BLOCKED";
  }

  // 🏦 Policy enforcement
  assertLedgerOnly(tx.source || "kernel", "finance.kernel");

  // 🧠 RETURN SAFE TRANSACTION FOR LEDGER
  return {
    id: tx.id,
    userId: tx.userId,
    amount: tx.amount,
    type: tx.type,
    source: "KERNEL_APPROVED"
  };
}

module.exports = { processTransaction };

