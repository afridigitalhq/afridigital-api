// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * HUMAN-IN-THE-LOOP AUTHORIZATION GATE
 * Final approval required for all sensitive actions
 */

class HumanApprovalGate {
  constructor() {
    this.pending = [];
  }

  request(action) {
    const id = Date.now();

    this.pending.push({
      id,
      action,
      status: "PENDING_APPROVAL"
    });

    return {
      id,
      status: "AWAITING_HUMAN_APPROVAL"
    };
  }

  approve(id) {
    return this._resolve(id, true);
  }

  reject(id) {
    return this._resolve(id, false);
  }

  _resolve(id, decision) {
    const item = this.pending.find(p => p.id === id);
    if (!item) return { error: "NOT_FOUND" };

    item.status = decision ? "APPROVED" : "REJECTED";

    return {
      id,
      executed: decision,
      action: item.action
    };
  }
}

module.exports = { HumanApprovalGate };
