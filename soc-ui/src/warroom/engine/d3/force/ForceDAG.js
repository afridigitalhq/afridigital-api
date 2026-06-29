import * as d3 from "d3";

export class ForceDAG {
  constructor(nodes, links) {
    this.simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).distance(80))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(400, 300));
  }

  tick() {
    this.simulation.tick();
    return this.simulation.nodes();
  }
}
