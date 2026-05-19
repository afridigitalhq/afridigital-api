
// CONSUMER (replays + listens to event streams)
const log = require('./event.log');

function consume(topic, handler) {
  const events = log.read(topic);

  events.forEach(record => {
    handler(record.event);
  });
}

module.exports = { consume };

