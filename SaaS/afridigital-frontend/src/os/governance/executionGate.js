/**
 * V11.5 CONTROLLED AUTONOMY GATE
 */

class ExecutionGate {
  constructor() {
    this.lastExecution = new Map();
    this.cooldowns = new Map();
  }

  canExecute(cmd, payload = {}) {
    const now = Date.now();

    // 1. BASIC RATE LIMIT
    const last = this.lastExecution.get(cmd) || 0;
    if (now - last < 1200) {
      console.warn("⛔ RATE LIMIT BLOCKED:", cmd);
      return false;
    }

    // 2. LOOP DETECTION (same command spam)
    const recentKey = `${cmd}:${JSON.stringify(payload)}`;
    if (this.cooldowns.get(recentKey)) {
      console.warn("⛔ LOOP DETECTED:", cmd);
      return false;
    }

    // mark execution
    this.lastExecution.set(cmd, now);
    this.cooldowns.set(recentKey, true);

    // auto-unlock after window
    setTimeout(() => {
      this.cooldowns.delete(recentKey);
    }, 3000);

    return true;
  }
}

export const executionGate = new ExecutionGate();
