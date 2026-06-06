import { globalState } from "../state/globalState.js";
import { eventBus } from "../events/eventBus.js";

export const uiContract = {
  init() {
    eventBus.on("STATE_UPDATED", (state) => {
      this.render(state);
    });
  },

  render(state) {
    // UI becomes PURE RENDERER ONLY
    // NO mutations allowed here
    return state;
  },

  getState() {
    return globalState.getState();
  }
};
