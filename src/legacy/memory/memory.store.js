const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../../data/memory/users.json");

function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch (e) {
    return {};
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getUser(userId) {
  const db = loadDB();
  return db[userId] || {
    messages: [],
    intents: [],
    traces: []
  };
}

function updateUser(userId, updateFn) {
  const db = loadDB();

  if (!db[userId]) {
    db[userId] = {
      messages: [],
      intents: [],
      traces: []
    };
  }

  db[userId] = updateFn(db[userId]) || db[userId];

  saveDB(db);
}

module.exports = {
  getUser,
  updateUser
};
