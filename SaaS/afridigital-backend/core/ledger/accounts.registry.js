
// ACCOUNTS REGISTRY
const balances = new Map();

function getBalance(account) {
  return balances.get(account) || 0;
}

function applyEntry({ account, debit = 0, credit = 0 }) {
  const current = getBalance(account);
  const newBalance = current + credit - debit;
  balances.set(account, newBalance);
  return newBalance;
}

module.exports = {
  balances,
  getBalance,
  applyEntry
};

