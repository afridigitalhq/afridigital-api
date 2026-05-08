const bus = require('../event-bus/bus');

let memory = [];

function stream(event) {
  memory.push(event);
  bus.emit('memory.update', event);
  return memory.slice(-50);
}

module.exports = { stream, memory };
