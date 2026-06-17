const store = require('./eventStore');

function replay(handler) {
  const events = store.readAll();

  for (const event of events) {
    handler(event);
  }

  return events.length;
}

module.exports = { replay };
