const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../database/db');

function isPremium(phone) {

  const users =
    db.read('users.db.json');

  const user =
    users.find(u => u.phone === phone);

  return user && user.premium === true;
}

function upgradeUser(phone) {

  const users =
    db.read('users.db.json');

  let user =
    users.find(u => u.phone === phone);

  if (!user) return false;

  user.premium = true;

  db.write('users.db.json', users);

  return true;
}

module.exports = {
  isPremium,
  upgradeUser
};
