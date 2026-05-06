const bus = require('../event-bus/bus');

const memory = [];

function stream(event) {
  memory.push(event);
  bus.emit('memory.update', event);
  return memory.slice(-50);
}

module.exports = { stream, memory };
