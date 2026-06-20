const fs = require("fs");
const path = require("path");
const bus = require('../eventbus');

function file(userId) {
  return path.join(__dirname, "../../data/users", userId, "notifications.json");
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

function add(userId, notification) {
  const list = get(userId);

  const note = {
    id: Date.now(),
    read: false,
    ...notification,
    timestamp: Date.now()
  };

  list.push(note);

  fs.writeFileSync(file(userId), JSON.stringify(list, null, 2));

  bus.emit("NOTIFICATION_CREATED", { userId, note });

  return note;
}

module.exports = { get, add };
