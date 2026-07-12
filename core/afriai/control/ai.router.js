const EventEmitter = require("events");
const { validate } = require("./policy.guard");

class AfriAIRouter extends EventEmitter {

  dispatch(command) {

    const check = validate(command);

    if (!check.ok) {
      return this.emit("rejected", {
        command,
        reason: check.reason
      });
    }

    this.emit("command", {
      ...command,
      ts: Date.now(),
      status: "APPROVED_FOR_KERNEL"
    });
  }

}

module.exports = new AfriAIRouter();
