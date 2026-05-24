const bus = require("../events/event.spine.cjs");

const jobs = [];

bus.on("JOB_POSTED", (job) => {
  jobs.push(job);
});

function listJobs() {
  return jobs;
}

module.exports = { listJobs };
