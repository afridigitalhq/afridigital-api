const bus = require("../event-bus/event.bus.cjs");

const state = {
  flow: "init",
  build: "init"
};

// STATE IS DERIVED FROM EVENTS ONLY
bus.on("FLOW_ADVANCE", (e) => {
  state.flow = e.next;
});

bus.on("BUILD_UPDATE", (e) => {
  state.build = e.status;
});

module.exports = state;
