import { commandBus } from "../commandBus.js";

/**
 * V11.5 SAFETY KERNEL
 * Prevents uncontrolled AI execution
 */

const allowed = new Set([
  "OPEN_WINDOW",
  "CLOSE_WINDOW"
]);

export const safetyGuard = {
  init() {},

  validate(command) {
    if (!command || !command.type) return false;

    // block unknown actions
    if (!allowed.has(command.type)) {
      console.warn("BLOCKED COMMAND:", command);
      return false;
    }

    // block malformed payloads
    if (!command.payload) return false;

    return true;
  },

  executeSafe(command) {
    if (this.validate(command)) {
      commandBus.execute(command);
    }
  }
};
