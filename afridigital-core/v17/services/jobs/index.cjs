const bus = require("../../spi../../afridigital-core/kernel/event-bus");
const EVENTS = require("../../contracts/events");

bus.on(EVENTS.JOB_CREATED, (job) => {
  console.log("📢 NEW JOB LISTING:", job.title);
});
