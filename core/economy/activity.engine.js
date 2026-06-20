const fs = require("fs");
const path = require("path");
const bus = require('../eventbus');

function file(userId) {
  return path.join(__dirname, "../../data/users", userId, "activity.json");
}

function ensure(userId) {
  const dir = path.dirname(file(userId));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(file(userId))) {
    fs.writeFileSync(file(userId), JSON.stringify([]));
  }
}

function get(userId) {
  ensure(userId);
  return JSON.parse(fs.readFileSync(file(userId)));
}

function log(userId, action, meta = {}) {
  const list = get(userId);

  const entry = {
    id: Date.now(),
    action,
    meta,
    timestamp: Date.now()
  };

  list.push(entry);

  fs.writeFileSync(file(userId), JSON.stringify(list, null, 2));

  bus.emit("ACTIVITY_LOGGED", { userId, entry });

  return entry;
}

module.exports = { get, log };
