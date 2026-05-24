const bus = require("../../spi../../afridigital-core/kern../../afridigital-core/kernel/events");
const EVENTS = require("../../contracts/events");

bus.on(EVENTS.JOB_CREATED, (job) => {
  console.log("📢 NEW JOB LISTING:", job.title);
});
