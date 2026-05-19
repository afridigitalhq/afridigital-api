const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../database/db');

function logEvent(type, data) {

  const events =
    db.read('events.db.json');

  events.push({
    type,
    data,
    timestamp: Date.now()
  });

  db.write('events.db.json', events);
}

module.exports = { logEvent };
