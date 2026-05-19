const jobs = [];

const { subscribe } = require("../../events/event.bus.cjs");

subscribe("JOB_POSTED", (job) => {
  jobs.push(job);
});

module.exports = jobs;
