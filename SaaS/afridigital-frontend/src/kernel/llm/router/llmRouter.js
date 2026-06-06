import { eventBus } from "../../events/eventBus.js";

export const llmRouter = {
  init() {},

  async ask(prompt, context = {}) {
    const mode = context.mode || "local";

    if (mode === "openai") {
      return this.openai(prompt);
    }

    return this.local(prompt);
  },

  async openai(prompt) {
    // placeholder: replace with real API call
    return {
      type: "OPENAI_RESPONSE",
      output: `openai:${prompt}`
    };
  },

  async local(prompt) {
    return {
      type: "LOCAL_RESPONSE",
      output: `local:${prompt}`
    };
  }
};
