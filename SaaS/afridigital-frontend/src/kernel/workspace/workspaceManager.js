import { eventBus } from "../events/eventBus.js";

let currentWorkspace = "main";

export const workspaceManager = {
  init() {
    eventBus.on("WORKSPACE_SWITCH", (ws) => {
      currentWorkspace = ws;

      eventBus.emit("STATE_PATCH", {
        system: {
          workspace: ws
        }
      });
    });
  },

  getCurrent() {
    return currentWorkspace;
  }
};
