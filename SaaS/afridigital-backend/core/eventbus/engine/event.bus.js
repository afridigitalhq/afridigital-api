const { assertApiVersion } = require("../runtime/safety/api.guard");
const listeners = {};

function emit(event, data) {

  if (!listeners[event]) return;

  listeners[event].forEach(fn =>
    fn(data)
  );
}

function on(event, fn) {

  if (!listeners[event]) {
    listeners[event] = [];
  }

  listeners[event].push(fn);
}

module.exports = {
  emit,
  on
};
