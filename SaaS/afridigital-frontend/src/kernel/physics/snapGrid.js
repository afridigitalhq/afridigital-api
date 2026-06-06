import { eventBus } from "../events/eventBus.js";

const GRID = 20;

export const snapGrid = {
  init() {
    eventBus.on("WINDOW_DROP", (payload) => {
      const snap = (val) => Math.round(val / GRID) * GRID;

      eventBus.emit("STATE_PATCH", {
        windows: {
          [payload.id]: {
            x: snap(payload.x),
            y: snap(payload.y)
          }
        }
      });
    });
  }
};
