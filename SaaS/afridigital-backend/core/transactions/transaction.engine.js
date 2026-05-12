const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../database/db');

function recordTransaction(tx) {

  const transactions =
    db.read('transactions.db.json');

  transactions.push({
    ...tx,
    id: Date.now(),
    timestamp: Date.now()
  });

  db.write('transactions.db.json', transactions);
}

module.exports = { recordTransaction };
