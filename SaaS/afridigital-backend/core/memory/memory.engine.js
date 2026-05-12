const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../database/db');

function remember(phone, key, value) {

  const memory =
    db.read('memory.db.json');

  let user =
    memory.find(m => m.phone === phone);

  if (!user) {

    user = {
      phone,
      memory: {}
    };

    memory.push(user);
  }

  user.memory[key] = value;

  db.write('memory.db.json', memory);

  return true;
}

function recall(phone, key) {

  const memory =
    db.read('memory.db.json');

  const user =
    memory.find(m => m.phone === phone);

  if (!user) return null;

  return user.memory[key];
}

module.exports = {
  remember,
  recall
};
