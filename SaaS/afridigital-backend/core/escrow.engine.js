const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🔒 AfriOS Escrow Engine v2.1.1
 * Autonomous + Dispute Override System
 */

const fs = require('fs');

const ESCROW_DB = './storage/escrow.json';

// 📦 LOAD ESCROW
function load() {
  try {
    return JSON.parse(fs.readFileSync(ESCROW_DB));
  } catch {
    return [];
  }
}

// 💾 SAVE ESCROW
function save(data) {
  fs.writeFileSync(ESCROW_DB, JSON.stringify(data, null, 2));
}

// 🔒 LOCK FUNDS
function lockEscrow(jobId, user, amount) {

  const db = load();

  db.push({
    jobId,
    user,
    amount,
    status: "LOCKED",
    createdAt: new Date().toISOString(),
    approvedByEmployer: false,
    autoReleaseAt: Date.now() + 24 * 60 * 60 * 1000
  });

  save(db);

  return db[db.length - 1];
}

// ✅ EMPLOYER APPROVAL
function employerApprove(jobId) {

  const db = load();

  const job = db.find(j => j.jobId === jobId);

  if (!job) return "NOT FOUND";

  job.status = "RELEASED";
  job.approvedByEmployer = true;

  save(db);

  return "💰 Escrow released to worker";
}

// ⏳ AUTO RELEASE CHECKER
function autoRelease() {

  const db = load();

  const now = Date.now();

  db.forEach(job => {

    if (
      job.status === "LOCKED" &&
      now > job.autoReleaseAt
    ) {
      job.status = "AUTO_RELEASED";
    }
  });

  save(db);

  return db;
}

// ⚖️ DISPUTE OVERRIDE (ADMIN ONLY LATER)
function resolveDispute(jobId, decision) {

  const db = load();

  const job = db.find(j => j.jobId === jobId);

  if (!job) return "NOT FOUND";

  job.status = decision === "approve"
    ? "RELEASED"
    : "REJECTED";

  save(db);

  return `DISPUTE RESOLVED: ${jobId}`;
}

module.exports = {
  lockEscrow,
  employerApprove,
  autoRelease,
  resolveDispute
};

function releaseEscrow(amount, userWallet, treasury) {

  const workerShare = Math.floor(amount * 0.60);
  const platformShare = Math.floor(amount * 0.40);

  return {
    workerShare,
    platformShare,
    creditWorker: workerShare,
    creditPlatform: platformShare
  };
}

module.exports.releaseEscrow = releaseEscrow;

