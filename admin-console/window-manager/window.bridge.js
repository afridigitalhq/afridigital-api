const bus = require('../../africore/runtime/event.bus');
const kernel = require('./window.kernel');

/**
 * 🧠 Window Manager Kernel Bridge (read-only control sync)
 */
function attachWindowKernel() {

  // auto-register core windows
  kernel.registerWindow("kernel-console");
  kernel.registerWindow("flowgraph");
  kernel.registerWindow("observability");

  // track system focus events
  bus.on("UI_FOCUS", (e) => {
    kernel.focusWindow(e.payload.windowId);
  });

  bus.on("UI_MOVE", (e) => {
    kernel.moveWindow(
      e.payload.windowId,
      e.payload.x,
      e.payload.y
    );
  });

  bus.on("UI_TOGGLE", (e) => {
    kernel.toggleWindow(e.payload.windowId);
  });

  console.log("🧠 WINDOW MANAGER KERNEL ACTIVE");
}

module.exports = { attachWindowKernel };
