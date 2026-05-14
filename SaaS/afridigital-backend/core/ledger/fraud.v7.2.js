class FraudV7_2 {
  constructor() {
    this.frozen = new Set();
    this.txHistory = new Map(); // userId -> timestamps[]
    this.score = new Map(); // userId -> risk score
  }

  isFrozen(userId) {
    return this.frozen.has(userId);
  }

  freeze(userId) {
    this.frozen.add(userId);
  }

  unfreeze(userId) {
    this.frozen.delete(userId);
  }

  _getHistory(userId) {
    return this.txHistory.get(userId) || [];
  }

  _pushHistory(userId) {
    const list = this._getHistory(userId);
    list.push(Date.now());

    // keep last 10 tx
    this.txHistory.set(userId, list.slice(-10));
  }

  _calcVelocity(userId) {
    const now = Date.now();
    const window = 60 * 1000; // 1 min
    return this._getHistory(userId).filter(t => now - t < window).length;
  }

  _updateScore(userId, amount, velocity) {
    let s = this.score.get(userId) || 0;

    if (velocity > 5) s += 20;
    if (amount > 100000) s += 15;

    s = Math.max(0, Math.min(100, s));
    this.score.set(userId, s);

    if (s >= 80) this.freeze(userId);

    return s;
  }

  guardTransaction({ userId, amount }) {
    this._pushHistory(userId);

    const velocity = this._calcVelocity(userId);
    const score = this._updateScore(userId, amount, velocity);

    if (this.isFrozen(userId)) {
      return {
        allowed: false,
        reason: "wallet_frozen",
        score
      };
    }

    if (velocity > 10) {
      return {
        allowed: false,
        reason: "velocity_limit_exceeded",
        velocity,
        score
      };
    }

    return {
      allowed: true,
      velocity,
      score
    };
  }
}

module.exports = new FraudV7_2();
