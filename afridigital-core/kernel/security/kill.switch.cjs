/**
 * 🧠 AFRI KILL SWITCH (STABLE CORE LAYER)
 */

class KillSwitch {

  constructor() {
    this.blockedUsers = new Set();
    this.blockedTx = new Set();
  }

  block(packet) {
    const p = packet?.payload || {};

    if (p.user) this.blockedUsers.add(p.user);
    if (p.id) this.blockedTx.add(p.id);

    console.log("⛔ KILL SWITCH ENGAGED:", {
      user: p.user,
      tx: p.id,
      score: p.riskScore || "unknown"
    });
  }

  isBlocked(packet) {
    const p = packet?.payload || {};

    return (
      this.blockedUsers.has(p.user) ||
      this.blockedTx.has(p.id)
    );
  }
}

module.exports = new KillSwitch();
