
// KAFKA BUS BRIDGE (replaces event.bus)
const producer = require('../../kafka/producer');

function emitEvent(topic, event) {
  return producer.produce(topic, event);
}

module.exports = { emitEvent };

