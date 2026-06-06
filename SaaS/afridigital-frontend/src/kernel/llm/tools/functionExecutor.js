import { eventBus } from "../../events/eventBus.js";

export const functionExecutor = {
  init() {},

  execute(fn) {
    const { name, args } = fn;

    switch (name) {
      case "open_window":
        return eventBus.emit("WINDOW_OPEN", args);

      case "close_window":
        return eventBus.emit("WINDOW_CLOSE", args);

      case "run_command":
        return eventBus.emit("COMMAND_EXECUTE", args);

      default:
        console.warn("❌ UNKNOWN TOOL:", name);
    }
  }
};
