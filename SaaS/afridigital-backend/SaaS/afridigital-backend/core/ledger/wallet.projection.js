
// WALLET PROJECTION ENGINE (rebuilds balance from ledger)
const fs = require('fs');
const path = require('path');

const LEDGER_FILE = path.join(__dirname, 'wallet.ledger.json');

function getLedger() {
  if (!fs.existsSync(LEDGER_FILE)) return [];
  return JSON.parse(fs.readFileSync(LEDGER_FILE));
}

function calculateBalance(userId) {
  const ledger = getLedger();

  return ledger.reduce((balance, event) => {
    if (event.userId !== userId) return balance;

    switch (event.type) {
      case 'CREDIT':
        return balance + Number(event.amount);
      case 'DEBIT':
        return balance - Number(event.amount);
      default:
        return balance;
    }
  }, 0);
}

function rebuildAllBalances() {
  const ledger = getLedger();
  const users = new Set(ledger.map(e => e.userId));

  const result = {};
  users.forEach(userId => {
    result[userId] = calculateBalance(userId);
  });

  return result;
}

module.exports = {
  calculateBalance,
  rebuildAllBalances
};

