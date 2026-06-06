import { memoryGraph } from "./memoryGraph.js";

export const agentRuntime = {
  init() {},

  tick(event) {
    memoryGraph.add({
      type: "AGENT_EVENT",
      event
    });
  }
};
