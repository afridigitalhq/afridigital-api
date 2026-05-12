const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function trackEvent(phone, event, data = {}) {

  const logs =
    db.read('learning.db.json');

  logs.push({
    phone,
    event,
    data,
    timestamp: Date.now()
  });

  db.write('learning.db.json', logs);
}

function getUserEvents(phone) {

  const logs =
    db.read('learning.db.json');

  return logs.filter(
    l => l.phone === phone
  );
}

module.exports = {
  trackEvent,
  getUserEvents
};
