
// PRODUCER (publishes events into Kafka log)
const log = require('./event.log');

function produce(topic, event) {
  return log.append(topic, event);
}

module.exports = { produce };

