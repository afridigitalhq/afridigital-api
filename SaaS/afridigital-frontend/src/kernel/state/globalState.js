import { eventBus } from "../events/eventBus.js";

let state = {
  windows: {},
  tasks: [],
  ui: {},
  system: {}
};

export const globalState = {
  init() {
    eventBus.on("STATE_PATCH", (patch) => {
      state = {
        ...state,
        ...patch,
        _ts: Date.now()
      };

      eventBus.emit("STATE_UPDATED", state);
    });
  },

  getState() {
    return state;
  }
};
