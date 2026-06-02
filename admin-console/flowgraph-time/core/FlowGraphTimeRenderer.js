/**
 * READ-ONLY VISUAL TIME ENGINE
 * Uses snapshot frames only
 */

export default class FlowGraphTimeRenderer {
  constructor(flowEngine) {
    this.engine = flowEngine;
    this.frames = [];
  }

  loadFrame(frames) {
    this.frames = frames;
    this.render();
  }

  render() {
    if (!this.engine) return;

    const nodes = new Map();

    this.frames.forEach(evt => {
      if (!nodes.has(evt.traceId)) {
        nodes.set(evt.traceId, {
          id: evt.traceId,
          intensity: 0
        });
      }

      const node = nodes.get(evt.traceId);
      node.intensity += 1;
    });

    this.engine.updateGraph(Array.from(nodes.values()));
  }
}
