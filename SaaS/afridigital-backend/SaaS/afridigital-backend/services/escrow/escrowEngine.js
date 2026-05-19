const { assertApiVersion } = require("../runtime/safety/api.guard");
const bus = require('../../core/kernel/events/event.bus');

class EscrowEngine {
  constructor() {
    this.escrow = new Map();
  }

  createEscrow(taskId, userId, amount) {
    wallet.debit(userId, amount);
    this.escrow.set(taskId, { userId, amount, status: "locked", created: Date.now() });
  }

  release(taskId) {
    const data = this.escrow.get(taskId);
    if (!data) return;
    this.escrow.delete(taskId);
    wallet.credit(data.userId, data.amount);
  }

  refund(taskId) {
    const data = this.escrow.get(taskId);
    if (!data) return;
    wallet.credit(data.userId, data.amount);
    this.escrow.delete(taskId);
  }
}

module.exports = new EscrowEngine();
