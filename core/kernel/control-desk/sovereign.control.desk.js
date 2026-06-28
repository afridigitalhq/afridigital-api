// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * HUMAN SOVEREIGN CONTROL DESK
 * Final approval authority layer (no execution rights)
 */

class HumanSovereignControlDesk {
  constructor() {
    this.queue = [];
    this.killSwitch = false;
  }

  submit(action) {
    this.queue.push({
      ...action,
      status: "PENDING_APPROVAL",
      timestamp: Date.now()
    });
  }

  approve(actionId) {
    if (this.killSwitch) return "SYSTEM_FROZEN";

    const action = this.queue.find(a => a.id === actionId);
    if (action) action.status = "APPROVED";

    return action;
  }

  reject(actionId) {
    const action = this.queue.find(a => a.id === actionId);
    if (action) action.status = "REJECTED";

    return action;
  }

  toggleKillSwitch(state) {
    this.killSwitch = state;
    return {
      system: state ? "FROZEN" : "ACTIVE",
      execution: "SyscallGate blocked when frozen"
    };
  }

  status() {
    return {
      pending: this.queue.filter(a => a.status === "PENDING_APPROVAL").length,
      killSwitch: this.killSwitch
    };
  }
}

module.exports = { HumanSovereignControlDesk };
