const BaseLedger = require("./ledger.v7.3");
const Smart = require("./ledger.v7.3.smart");
const smartEngine = new Smart(BaseLedger);

class LedgerSmartWrapper {

  credit(userId, amount, meta = {}) {
    return BaseLedger.credit(userId, amount, meta);
  }

  debit(userId, amount, meta = {}) {
    return BaseLedger.debit(userId, amount, meta);
  }

  transfer(fromUser, toUser, amount) {
    // Smart routing ONLY for transfers
    return smartEngine.transfer(fromUser, toUser, amount);
  }

  getBalance(userId) {
    return BaseLedger._getBalance
      ? BaseLedger._getBalance(userId)
      : 0;
  }
}

module.exports = new LedgerSmartWrapper();
