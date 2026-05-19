const { emit } = require("../events/event.bus.cjs");
const { evaluate } = require("../fraud/fraud.guard.cjs");

console.log("💰 ECONOMY ENGINE ACTIVE");

function createJob(job) {
  const check = evaluate(job);

  if (!check.approved) {
    return { status: "rejected", reason: "fraud risk", score: check.score };
  }

  emit("JOB_CREATED", job);

  return { status: "published", job };
}

function completeJob(job) {
  emit("JOB_COMPLETED", job);
}

module.exports = { createJob, completeJob };
