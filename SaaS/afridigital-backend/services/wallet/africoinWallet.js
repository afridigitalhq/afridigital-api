const config = require('../../config/africoinConfig');

class AfriCoinWallet {
  constructor() {
    this.balances = new Map();
  }

  getBalance(userId) {
    return this.balances.get(userId) || 0;
  }

  credit(userId, amount) {
    const current = this.getBalance(userId);
    this.balances.set(userId, current + amount);
  }

  debit(userId, amount) {
    const current = this.getBalance(userId);
    if (current < amount) throw new Error("Insufficient AfriCoin");
    this.balances.set(userId, current - amount);
  }

  convertNGNToCoin(ngn) {
    return ngn * config.NGN_TO_AFRICOIN;
  }

  convertCoinToNGN(coin) {
    return coin * config.AFRICOIN_TO_NGN;
  }
}

module.exports = new AfriCoinWallet();
