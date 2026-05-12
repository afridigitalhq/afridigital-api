const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 💰 AfriOS Auto Payment Engine v2.3
 */

const fs = require('fs');

const JOB_DB = './storage/jobs.json';
const LEDGER = require('./ledger.engine');

// 📦 LOAD JOBS
function load() {
  try {
    return JSON.parse(fs.readFileSync(JOB_DB));
  } catch {
    return [];
  }
}

// 💾 SAVE JOBS
function save(data) {
  fs.writeFileSync(JOB_DB, JSON.stringify(data, null, 2));
}

// 💰 AUTO PAY WORKERS
function runAutoPay() {

  const jobs = load();

  const now = Date.now();

  jobs.forEach(job => {

    // ⏳ AUTO PAY CONDITION
    if (
      job.status === "PENDING_REVIEW" &&
      now > job.autoPayAt &&
      !job.disputed
    ) {

      job.status = "PAID";

      // 💰 CREDIT WORKER WALLET
      LEDGER.createTransaction({
        user: job.worker,
        type: "EARN",
        amount: job.amount,
        meta: {
          jobId: job.id,
          source: "AUTO_PAY"
        }
      });

      console.log("💰 AUTO PAID:", job.id);
    }
  });

  save(jobs);

  return jobs;
}

module.exports = {
  runAutoPay
};
