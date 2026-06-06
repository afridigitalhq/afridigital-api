import { eventBus } from "../events/eventBus.js";

const velocityMap = {};

export const windowPhysics = {
  init() {
    eventBus.on("WINDOW_DRAG", (payload) => {
      const { id, x, y, vx = 0, vy = 0 } = payload;

      velocityMap[id] = { vx, vy };

      eventBus.emit("STATE_PATCH", {
        windows: {
          [id]: { x, y }
        }
      });
    });

    this.startInertiaLoop();
  },

  startInertiaLoop() {
    setInterval(() => {
      Object.keys(velocityMap).forEach((id) => {
        const v = velocityMap[id];
        if (!v) return;

        v.vx *= 0.92;
        v.vy *= 0.92;

        if (Math.abs(v.vx) < 0.1 && Math.abs(v.vy) < 0.1) return;

        eventBus.emit("WINDOW_INERTIA_UPDATE", {
          id,
          vx: v.vx,
          vy: v.vy
        });
      });
    }, 16);
  }
};
