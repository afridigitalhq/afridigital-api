import { windowManager } from "../desktop/windowManager.js";

let active = null;

export const dragEngine = {
  init() {},

  start(id, x, y) {
    active = { id, x, y };
  },

  move(x, y) {
    if (!active) return;

    windowManager.move(active.id, x, y);
  },

  end() {
    active = null;
  }
};
