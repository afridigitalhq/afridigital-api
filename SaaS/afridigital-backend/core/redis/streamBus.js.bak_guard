const eventBus = require("../africore/runtime/eventBus");

function publish(stream, payload) {
  eventBus.publish(stream, payload);
}

function subscribe(stream, handler) {
  eventBus.subscribe(stream, handler);
}

module.exports = {
  publish,
  subscribe
};
