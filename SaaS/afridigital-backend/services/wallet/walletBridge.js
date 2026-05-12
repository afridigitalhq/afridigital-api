const { assertApiVersion } = require("../runtime/safety/api.guard");
const bus = require('../../core/kernel/events/event.bus');

class WalletBridge {
  deposit(userId, ngn) {
    const coins = wallet.convertNGNToCoin(ngn);
    bus.emitEvent('wallet.credit.requested',(userId, coins);
    return { ngn, coins };
  }

  withdraw(userId, coins) {
    bus.emitEvent('wallet.debit.requested',(userId, coins);
    return wallet.convertCoinToNGN(coins);
  }
}

module.exports = new WalletBridge();
