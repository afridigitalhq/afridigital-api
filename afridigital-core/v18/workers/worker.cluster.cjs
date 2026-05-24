const { on, channels } = require("../redis/redis.spine.cjs");
const EventBus = require("../events/event.bus.cjs");

function processJob(job) {
  if (job.type === "AD_POST") {
    return { status: "PUBLISHED", job };
  }

  if (job.type === "AFFILIATE_TASK") {
    return { status: "READY", job };
  }

  return { status: "IGNORED", job };
}

on(channels.jobs, (job) => {
  const result = processJob(job);

  EventBus.publish("JOB_PROCESSED", result);
});
