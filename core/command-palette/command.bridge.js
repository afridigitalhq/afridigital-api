const bus = require('../../africore/runtime/event.bus');
const { runCommand } = require('./command.kernel');

/**
 * 🧠 Command palette bridge (event-driven)
 */
function attachCommandKernel() {

  bus.on("COMMAND_RUN", (e) => {
    const result = runCommand(e.payload.command, e.payload.args);

    bus.emitEvent({
      type: "COMMAND_RESULT",
      traceId: e.traceId || "system",
      payload: result
    });
  });

  console.log("🧠 COMMAND PALETTE KERNEL ACTIVE");
}

module.exports = { attachCommandKernel };
