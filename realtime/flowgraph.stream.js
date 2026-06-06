const bus = require("./event.stream");
const { pushTrace } = require("./execution.trace");

bus.onAny = function(event, payload) {
  pushTrace({
    event,
    payload
  });
};

module.exports = bus;
