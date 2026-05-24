const { emit } = require("../../events/event.bus.cjs");

function autoPost(job) {
  emit("JOB_PUBLISHED", {
    ...job,
    status: "published"
  });

  return job;
}

module.exports = { autoPost };
