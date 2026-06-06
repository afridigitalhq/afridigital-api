import { eventBus } from "../../events/eventBus.js";

let locked = false;

export const aiGuard = {
  init() {
    eventBus.on("AI_ACTION_REQUEST", (action) => {
      if (locked) {
        console.warn("🛑 AI ACTION BLOCKED (SYSTEM LOCKED)");
        return;
      }

      if (action?.type === "DANGEROUS_LAYOUT_OVERWRITE") {
        console.warn("🛑 BLOCKED: Unsafe AI layout mutation");
        return;
      }

      eventBus.emit(action.type, action.payload);
    });
  },

  lock() {
    locked = true;
  },

  unlock() {
    locked = false;
  }
};
