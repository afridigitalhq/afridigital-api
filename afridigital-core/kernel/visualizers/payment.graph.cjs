/**
 * 💳 PAYMENT FLOW GRAPH ENGINE v1
 * Builds lifecycle nodes from event stream
 */

class PaymentGraph {
  constructor() {
    this.graph = new Map();
  }

  ingest(event) {
    const { event: name, payload } = event;

    if (!name.includes("PAYMENT") && !name.includes("INVOICE")) return;

    const id =
      payload?.id ||
      payload?.transactionId ||
      payload?.reference ||
      "UNKNOWN_TX";

    if (!this.graph.has(id)) {
      this.graph.set(id, {
        id,
        stages: [],
        createdAt: Date.now()
      });
    }

    const node = this.graph.get(id);

    node.stages.push({
      event: name,
      payload,
      ts: event.ts
    });
  }

  getGraph(limit = 20) {
    return Array.from(this.graph.values()).slice(-limit);
  }
}

module.exports = new PaymentGraph();
