import { eventBus } from "../events/eventBus.js";

let topZ = 10;

export const zIndexManager = {
  init() {
    eventBus.on("WINDOW_FOCUS", (id) => {
      topZ++;

      eventBus.emit("STATE_PATCH", {
        windows: {
          [id]: {
            zIndex: topZ
          }
        }
      });
    });
  }
};
