class Ledger {
  constructor() {
    this.balances = new Map();
    this.tx = [];
  }

  get(userId) {
    return this.balances.get(userId) || 0;
  }

  credit(userId, amount, meta = {}) {
    const v = this.get(userId) + amount;
    this.balances.set(userId, v);
    this.tx.push({ type: "CREDIT", userId, amount, meta });
    return v;
  }

  debit(userId, amount, meta = {}) {
    const v = this.get(userId);
    if (v < amount) throw new Error("INSUFFICIENT_FUNDS");

    const nv = v - amount;
    this.balances.set(userId, nv);
    this.tx.push({ type: "DEBIT", userId, amount, meta });
    return nv;
  }

  snapshot() {
    return {
      balances: Object.fromEntries(this.balances),
      tx: this.tx.slice(-200)
    };
  }
}

module.exports = Ledger;
