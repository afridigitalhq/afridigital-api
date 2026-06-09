const eventBus = require("../kernel/events/eventBus");

const commandRouter = {
  execute(command, context) {

    if (!command || !command.type) {
      throw new Error("INVALID_COMMAND");
    }

    eventBus.emit("COMMAND_RECEIVED", { command, context });

    let result;

    switch (command.type) {
      case "SYSTEM":
        result = { ok: true, scope: "system" };
        break;

      case "USER":
        result = { ok: true, scope: "user" };
        break;

      case "ADMIN":
        if (context.role !== "admin") {
          throw new Error("UNAUTHORIZED");
        }
        result = { ok: true, scope: "admin" };
        break;

      default:
        throw new Error("UNKNOWN_COMMAND_TYPE");
    }

    eventBus.emit("COMMAND_EXECUTED", { command, result });

    return result;
  }
};

module.exports = commandRouter;
