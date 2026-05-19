const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../database/db');

function getWallet(phone) {

  const wallets =
    db.read('wallet.db.json');

  return wallets.find(
    w => w.phone === phone
  ) || {
    phone,
    balance: 0
  };
}

function credit(phone, amount, reason) {

  const wallets =
    db.read('wallet.db.json');

  let wallet =
    wallets.find(w => w.phone === phone);

  if (!wallet) {
    wallet = { phone, balance: 0 };
    wallets.push(wallet);
  }

  wallet.balance += amount;

  require('../analytics/analytics.engine')
    .logEvent('CREDIT', { phone, amount, reason });

  db.write('wallet.db.json', wallets);

  return wallet;
}

function debit(phone, amount, reason) {

  const wallets =
    db.read('wallet.db.json');

  let wallet =
    wallets.find(w => w.phone === phone);

  if (!wallet || wallet.balance < amount) {
    return {
      error: 'INSUFFICIENT_FUNDS'
    };
  }

  wallet.balance -= amount;

  require('../analytics/analytics.engine')
    .logEvent('DEBIT', { phone, amount, reason });

  db.write('wallet.db.json', wallets);

  return wallet;
}

module.exports = {
  getWallet,
  credit,
  debit
};
