import { agentRuntime } from "./runtime/agentRuntime.js";

export const agents = {
  init() {
    agentRuntime.init();
  },

  createTask(type, payload) {
    return {
      id: crypto.randomUUID(),
      type,
      payload
    };
  }
};
