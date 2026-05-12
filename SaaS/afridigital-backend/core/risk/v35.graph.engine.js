const { assertApiVersion } = require("../runtime/safety/api.guard");
class GraphEngineV35 {
  constructor() {
    this.graph = new Map(); // userId -> Set of connected users
    this.edgeMeta = new Map(); // "a->b" -> metadata
  }

  // -----------------------------
  // ADD RELATIONSHIP EDGE
  // -----------------------------
  addEdge(from, to, meta = {}) {
    if (!this.graph.has(from)) this.graph.set(from, new Set());
    this.graph.get(from).add(to);

    const key = `${from}->${to}`;
    this.edgeMeta.set(key, {
      ...meta,
      ts: Date.now()
    });
  }

  // -----------------------------
  // BUILD GRAPH FROM TRANSACTION
  // -----------------------------
  ingestTransaction(tx) {
    const { type, userId, targetUserId, meta = {} } = tx;

    if (!targetUserId) return;

    this.addEdge(userId, targetUserId, {
      type,
      amount: tx.amount,
      ...meta
    });
  }

  // -----------------------------
  // RISK PROPAGATION SCORE
  // -----------------------------
  propagationRisk(userId, depth = 3, visited = new Set()) {
    if (depth === 0 || visited.has(userId)) return 0;

    visited.add(userId);

    const neighbors = this.graph.get(userId) || new Set();

    let score = neighbors.size * 5;

    for (const n of neighbors) {
      score += this.propagationRisk(n, depth - 1, visited);
    }

    return score;
  }

  // -----------------------------
  // CENTRALITY SCORE (INFLUENCE RISK)
  // -----------------------------
  centrality(userId) {
    let incoming = 0;
    let outgoing = 0;

    for (const [node, edges] of this.graph.entries()) {
      if (node === userId) outgoing += edges.size;
      if (edges.has(userId)) incoming += 1;
    }

    return incoming + outgoing;
  }

  // -----------------------------
  // FRAUD RING DETECTION
  // -----------------------------
  detectRing(userId) {
    const cluster = new Set();
    const queue = [userId];

    while (queue.length) {
      const current = queue.shift();
      if (cluster.has(current)) continue;

      cluster.add(current);

      const neighbors = this.graph.get(current) || new Set();
      for (const n of neighbors) {
        if (!cluster.has(n)) queue.push(n);
      }
    }

    return {
      ringSize: cluster.size,
      members: [...cluster]
    };
  }

  // -----------------------------
  // GLOBAL RISK EVALUATION
  // -----------------------------
  evaluate(userId) {
    const propRisk = this.propagationRisk(userId);
    const cent = this.centrality(userId);
    const ring = this.detectRing(userId);

    const riskScore = Math.min(
      100,
      propRisk + cent * 2 + ring.ringSize
    );

    let decision = "ALLOW";
    if (riskScore >= 80) decision = "BLOCK";
    else if (riskScore >= 50) decision = "REVIEW";

    return {
      userId,
      riskScore,
      decision,
      centrality: cent,
      propagationRisk: propRisk,
      ringSize: ring.ringSize
    };
  }

  getGraphStats() {
    return {
      nodes: this.graph.size,
      edges: [...this.edgeMeta.keys()].length
    };
  }
}

module.exports = new GraphEngineV35();
