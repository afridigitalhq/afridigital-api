const wallets = new Map();

function credit(userId, amount) {
  const w = wallets.get(userId) || 0;
  wallets.set(userId, w + amount);
}

function debit(userId, amount) {
  const w = wallets.get(userId) || 0;
  wallets.set(userId, Math.max(0, w - amount));
}

function balance(userId) {
  return wallets.get(userId) || 0;
}

module.exports = { credit, debit, balance };
