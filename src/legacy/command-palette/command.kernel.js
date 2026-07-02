/**
 * 🧠 AI OS COMMAND PALETTE KERNEL
 * global system command router (read-safe)
 */

const bus = require('../../africore/runtime/event.bus');
const { getKernelState } = require('../kernel-interface');
const timeline = require('../timeline/time.engine');

/**
 * Command registry
 */
const commands = {
  "kernel.status": () => getKernelState(),

  "timeline.replay": (args) =>
    timeline.replay(args?.traceId),

  "timeline.latest": () =>
    timeline._timeline.slice(-20),

  "system.health": () => ({
    status: "ok",
    kernel: getKernelState().mode
  }),

  "flowgraph.open": () => ({
    action: "OPEN_FLOWGRAPH"
  }),

  "observability.open": () => ({
    action: "OPEN_OBSERVABILITY"
  }),

  "windows.list": () =>
    ({ action: "GET_WINDOW_STATE" }),

  "help": () =>
    Object.keys(commands)
};

/**
 * Execute command safely
 */
function runCommand(input, args = {}) {

  const cmd = commands[input];

  if (!cmd) {
    return { error: "UNKNOWN_COMMAND" };
  }

  const result = cmd(args);

  bus.emitEvent({
    type: "COMMAND_EXECUTED",
    stage: "kernel",
    traceId: "system",
    payload: { input, args, result }
  });

  return result;
}

/**
 * Search commands (Ctrl+K UI uses this)
 */
function searchCommands(query = "") {
  return Object.keys(commands)
    .filter(c => c.includes(query))
    .slice(0, 10);
}

module.exports = {
  runCommand,
  searchCommands
};
