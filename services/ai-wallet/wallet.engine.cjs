const wallets = {};

function balance(user) {
  return wallets[user] || 0;
}

function topup(user, amount) {
  wallets[user] = (wallets[user] || 0) + amount;
}

function withdraw(user, amount) {
  wallets[user] = (wallets[user] || 0) - amount;
}

module.exports = {
  balance,
  topup,
  withdraw
};
