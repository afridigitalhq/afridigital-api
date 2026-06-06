import { eventBus } from "../events/eventBus.js";

const history = [];

export const predictor = {
  init() {
    eventBus.on("STATE_UPDATED", (state) => {
      history.push({
        ts: Date.now(),
        snapshot: state
      });

      if (history.length > 50) history.shift();
    });
  },

  predictNext() {
    const last = history[history.length - 1];
    if (!last) return null;

    return {
      suggestion: "OPTIMIZE_LAYOUT",
      confidence: 0.62
    };
  }
};
