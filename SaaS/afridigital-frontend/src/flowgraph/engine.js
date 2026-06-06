import { Kernel } from "../kernel/core";

export const FlowGraph = {
  nodes: [],

  addNode(node) {
    this.nodes.push(node);
    Kernel.emit("flowgraph:update", this.nodes);
  }
};
