const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../database/db');

function createSession(phone) {

  const sessions =
    db.read('sessions.db.json');

  let session =
    sessions.find(s => s.phone === phone);

  if (!session) {

    session = {
      phone,
      active: true,
      startedAt: Date.now(),
      lastActivity: Date.now()
    };

    sessions.push(session);
  }

  session.lastActivity = Date.now();

  db.write('sessions.db.json', sessions);

  return session;
}

function getSession(phone) {

  const sessions =
    db.read('sessions.db.json');

  return sessions.find(
    s => s.phone === phone
  );
}

module.exports = {
  createSession,
  getSession
};
