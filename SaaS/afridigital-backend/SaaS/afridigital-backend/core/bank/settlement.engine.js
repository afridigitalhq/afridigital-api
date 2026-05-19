const finality = require("../ledger/finality/finality.engine");

class SettlementEngine {
  constructor(ledger) {
    this.ledger = ledger;
  }

  transfer(from, to, amount, ledgerEngine) {
    return finality.wrap(from, () => {
      if (amount <= 0) throw new Error("INVALID_AMOUNT");

      // enforce atomic double-entry rule
      ledgerEngine.debit(from, amount, { to });
      ledgerEngine.credit(to, amount, { from });

      return {
        status: "SETTLED",
        from,
        to,
        amount
      };
    });
  }
}

module.exports = SettlementEngine;
