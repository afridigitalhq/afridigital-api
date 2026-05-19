const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function getSystemMetrics() {

  return {
    users: db.read('users.db.json').length,
    messages: db.read('messages.db.json').length,
    ads: db.read('ads.db.json').length,
    wallets: db.read('wallet.db.json').length,
    transactions: db.read('transactions.db.json').length
  };
}

module.exports = { getSystemMetrics };
