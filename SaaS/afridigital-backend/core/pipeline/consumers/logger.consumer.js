const bus = require("../bus/eventBus");
const EVENTS = require("../events/eventTypes");

Object.values(EVENTS).forEach(event => {
  bus.on(event, (e) => {
    console.log("📊 LOG EVENT:", e.event, "| trace:", e.traceId);
  });
});
