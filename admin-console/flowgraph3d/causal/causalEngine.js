export class CausalEngine {
  constructor() {
    this.causes = new Map();
  }

  record(event) {
    const id = event.traceId || "unknown";

    if (!this.causes.has(id)) {
      this.causes.set(id, {
        createdBy: event.type,
        firstSeen: Date.now(),
        dependencies: []
      });
    }

    const node = this.causes.get(id);

    if (event.payload?.dependsOn) {
      node.dependencies.push(event.payload.dependsOn);
    }
  }

  explain(traceId) {
    return this.causes.get(traceId) || {
      createdBy: "unknown",
      dependencies: []
    };
  }
}
