import { eventBus } from "../events/eventBus.js";

let uiState = {};

export const reconciler = {
  init() {
    eventBus.on("WINDOW_STATE_UPDATE", (state) => {
      uiState.windows = state;
    });

    eventBus.on("TASK_STATE_UPDATE", (state) => {
      uiState.tasks = state;
    });
  },

  getState() {
    return uiState;
  }
};
