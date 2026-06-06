import { KernelBus } from "../kernel/eventBus";

export const FlowGraph = {
  nodes: [],

  add(node) {
    this.nodes.push(node);
    KernelBus.emit("flowgraph:update", this.nodes);
  }
};
