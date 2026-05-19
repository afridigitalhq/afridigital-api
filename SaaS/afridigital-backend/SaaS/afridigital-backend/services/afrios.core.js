const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require('fs');

const DB_PATH = './storage/os/state.db.json';

function load() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function save(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// SESSION
function getSession(user) {
  const db = load();
  if (!db.sessions[user]) {
    db.sessions[user] = {
      lastIntent: null,
      lastActive: Date.now()
    };
  }
  save(db);
  return db.sessions[user];
}

// LEDGER
function addPoints(user, points, reason) {
  const db = load();

  if (!db.ledger[user]) {
    db.ledger[user] = { points: 0, history: [] };
  }

  db.ledger[user].points += points;
  db.ledger[user].history.push({
    points,
    reason,
    time: new Date().toISOString()
  });

  save(db);
}

// EVENTS
function emit(event, data) {
  const db = load();

  db.events.push({
    event,
    data,
    time: new Date().toISOString()
  });

  save(db);
}

module.exports = {
  getSession,
  addPoints,
  emit
};
