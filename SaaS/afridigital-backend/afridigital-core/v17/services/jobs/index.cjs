const bus = require("../../spine/event-bus");
const EVENTS = require("../../contracts/events");

bus.on(EVENTS.JOB_CREATED, (job) => {
  console.log("📢 NEW JOB LISTING:", job.title);
});
