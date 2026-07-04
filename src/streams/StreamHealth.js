export class StreamHealth {
  constructor(gateway) {
    this.gateway = gateway;
    this.healthMap = new Map();
  }

  evaluate(session) {
    if (!session) return null;

    const now = Date.now();
    const age = now - session.startedAt;

    let status = "HEALTHY";

    if (age > 60000) status = "STALE";
    if (age > 120000) status = "DEGRADED";

    const health = {
      sessionId: session.id,
      cameraId: session.cameraId,
      status,
      age,
      protocol: session.protocol
    };

    this.healthMap.set(session.id, health);
    return health;
  }

  evaluateAll() {
    const sessions = this.gateway.getAllSessions();
    return sessions.map((s) => this.evaluate(s));
  }

  getHealth(sessionId) {
    return this.healthMap.get(sessionId) || null;
  }
}
