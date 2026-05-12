const { assertApiVersion } = require("../runtime/safety/api.guard");
const bus = require('../../core/kernel/events/event.bus');

class WalletBridge {
  deposit(userId, ngn) {
    const coins = wallet.convertNGNToCoin(ngn);
    wallet.credit(userId, coins);
    return { ngn, coins };
  }

  withdraw(userId, coins) {
    wallet.debit(userId, coins);
    return wallet.convertCoinToNGN(coins);
  }
}

module.exports = new WalletBridge();
