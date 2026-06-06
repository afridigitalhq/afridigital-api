import { eventBus } from "../events/eventBus.js";

export const uiBridge = {
  init() {},

  syncWindowState(state) {
    eventBus.emit("WINDOW_STATE_UPDATE", state);
  },

  syncTaskState(state) {
    eventBus.emit("TASK_STATE_UPDATE", state);
  }
};
