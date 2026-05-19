const balances = new Map();

function credit(userId, amount) {
  const current = balances.get(userId) || 0;
  balances.set(userId, current + amount);
}

function debit(userId, amount) {
  const current = balances.get(userId) || 0;
  balances.set(userId, Math.max(0, current - amount));
}

function getBalance(userId) {
  return balances.get(userId) || 0;
}

module.exports = { credit, debit, getBalance };
