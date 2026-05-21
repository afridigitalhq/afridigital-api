const bus = require("../afridigital-core/kernel/events/event.bus.cjs");

function postJob(job) {
  bus.emitEvent("JOB_POSTED", job);
  console.log("📢 JOB BROADCASTED:", job.title);
}

function listJobs() {
  console.log("📡 FETCHING AVAILABLE JOBS...");
}

module.exports = { postJob, listJobs };
