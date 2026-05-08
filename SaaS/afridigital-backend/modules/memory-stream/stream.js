const bus = require('../event-bus/bus');

const memoryInstance = [];

function stream(event) {
  memory.push(event);
  bus.emit('memory.update', event);
  return memory.slice(-50);
}

module.exports = { stream, memory };
