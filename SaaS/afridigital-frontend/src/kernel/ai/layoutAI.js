import { eventBus } from "../events/eventBus.js";
import { globalState } from "../state/globalState.js";

export const layoutAI = {
  init() {
    eventBus.on("AI_LAYOUT_REQUEST", (ctx) => {
      const state = globalState.getState();

      const windows = state.windows || {};

      const layout = Object.keys(windows).map((id, i) => ({
        id,
        x: 50 + (i * 30),
        y: 50 + (i * 30)
      }));

      eventBus.emit("STATE_PATCH", {
        windows: layout.reduce((acc, w) => {
          acc[w.id] = { x: w.x, y: w.y };
          return acc;
        }, {})
      });
    });
  }
};
