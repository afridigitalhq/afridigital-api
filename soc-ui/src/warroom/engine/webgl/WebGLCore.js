export class WebGLCore {
  constructor(canvas) {
    this.canvas = canvas;
    this.nodes = [];
    this.links = [];
  }

  addNode(node) {
    this.nodes.push(node);
  }

  addLink(link) {
    this.links.push(link);
  }

  simulate() {
    // SOC attack propagation physics placeholder
    return {
      heat: Math.random() * 100,
      pressure: Math.random() * 1,
      timestamp: Date.now()
    };
  }
}
