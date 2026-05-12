const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function getMetrics() {

  const users =
    db.read('users.db.json');

  const messages =
    db.read('messages.db.json');

  const ads =
    db.read('ads.db.json');

  const wallet =
    db.read('wallet.db.json');

  return {
    users: users.length,
    messages: messages.length,
    ads: ads.length,
    totalWallets: wallet.length
  };
}

module.exports = { getMetrics };
