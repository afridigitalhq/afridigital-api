const balances = new Map();

function credit(user, amount) {
  balances.set(user, (balances.get(user) || 0) + amount);
}

function debit(user, amount) {
  balances.set(user, (balances.get(user) || 0) - amount);
}

function getBalance(user) {
  return balances.get(user) || 0;
}

module.exports = { credit, debit, getBalance };
