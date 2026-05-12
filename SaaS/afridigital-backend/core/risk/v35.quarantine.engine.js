const { assertApiVersion } = require("../runtime/safety/api.guard");
const GraphEngine = require("./v35.graph.engine");

class QuarantineEngineV35 {
  constructor() {
    this.quarantinedUsers = new Map(); // userId -> reason
    this.ringLocks = new Map();        // ringId -> status
  }

  // -----------------------------
  // QUARANTINE USER
  // -----------------------------
  quarantineUser(userId, reason = "RISK_DETECTED") {
    this.quarantinedUsers.set(userId, {
      reason,
      ts: Date.now(),
      level: "USER_LOCK"
    });

    return { userId, status: "QUARANTINED", reason };
  }

  // -----------------------------
  // QUARANTINE FRAUD RING
  // -----------------------------
  quarantineRing(userId, reason = "RING_DETECTED") {
    const ring = GraphEngine.detectRing(userId);

    const ringId = this.hashRing(ring.members);

    this.ringLocks.set(ringId, {
      members: ring.members,
      reason,
      ts: Date.now(),
      status: "LOCKED"
    });

    for (const member of ring.members) {
      this.quarantineUser(member, "RING_LOCK");
    }

    return {
      ringId,
      size: ring.ringSize,
      status: "QUARANTINED_RING"
    };
  }

  // -----------------------------
  // HASH RING IDENTIFIER
  // -----------------------------
  hashRing(members) {
    return Buffer.from(members.sort().join(",")).toString("base64");
  }

  // -----------------------------
  // CHECK ACCESS
  // -----------------------------
  isBlocked(userId) {
    return this.quarantinedUsers.has(userId);
  }

  // -----------------------------
  // ENFORCEMENT GATE (CALL THIS BEFORE ANY TX)
  // -----------------------------
  enforce(userId, txContext = {}) {
    if (this.isBlocked(userId)) {
      return {
        allowed: false,
        reason: "USER_QUARANTINED"
      };
    }

    const evaluation = GraphEngine.evaluate(userId);

    if (evaluation.decision === "BLOCK") {
      this.quarantineUser(userId, "AUTO_BLOCK");
      return {
        allowed: false,
        reason: "AUTO_BLOCK"
      };
    }

    if (evaluation.ringSize >= 4 && evaluation.centrality > 5) {
      return this.quarantineRing(userId, "SUSPICIOUS_RING");
    }

    return { allowed: true };
  }

  // -----------------------------
  // RELEASE FROM QUARANTINE
  // -----------------------------
  release(userId) {
    this.quarantinedUsers.delete(userId);
    return { userId, status: "RELEASED" };
  }

  // -----------------------------
  // SYSTEM STATUS
  // -----------------------------
  getStatus() {
    return {
      quarantinedUsers: this.quarantinedUsers.size,
      lockedRings: this.ringLocks.size
    };
  }
}

module.exports = new QuarantineEngineV35();
