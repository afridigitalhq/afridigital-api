export class HybridControllerV3 {
  constructor({ wsFactory, restClient, gpuMonitor, dagEngine }) {
    this.wsFactory = wsFactory;
    this.restClient = restClient;
    this.gpuMonitor = gpuMonitor;
    this.dagEngine = dagEngine;

    this.wsPool = new Map();
    this.modeCache = new Map();
  }

  // =========================
  // PHASE 2: DAG-AWARE ROUTING
  // =========================
  resolveMode(node) {
    if (this.gpuMonitor?.load > 85) return "REST";

    switch (node?.type) {
      case "STATIC_NODE":
        return "REST";

      case "LIVE_NODE":
        return "LIVE";

      case "GPU_NODE":
        return this.gpuMonitor?.load > 60 ? "REST" : "LIVE";

      case "OBSERVABILITY_NODE":
        return "HYBRID";

      default:
        return "REST";
    }
  }

  send(node, payload) {
    const mode = this.resolveMode(node);

    this.modeCache.set(node.id, mode);

    if (mode === "LIVE" && this.wsPool.has(node.id)) {
      this.wsPool.get(node.id).send(JSON.stringify(payload));
      return;
    }

    return this.restClient.post("/api/fallback", {
      nodeId: node.id,
      payload
    });
  }

  attach(node) {
    try {
      const ws = this.wsFactory(node.endpoint);

      ws.onopen = () => {
        this.wsPool.set(node.id, ws);
      };

      ws.onerror = () => {
        this.wsPool.delete(node.id);
      };

      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          this.dagEngine?.update(node.id, data);
        } catch (e) {}
      };
    } catch (e) {
      this.modeCache.set(node.id, "REST");
    }
  }

  getMode(nodeId) {
    return this.modeCache.get(nodeId) || "REST";
  }
}
