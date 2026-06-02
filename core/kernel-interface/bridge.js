const bus = require('../../africore/runtime/event.bus');
const { tapKernel } = require('./index');

/**
 * 🧠 Kernel Observer Bridge (read-only)
 */
function attachKernelBridge() {

  const events = [
    "AI_REQUEST",
    "TRACE",
    "SYSTEM_ERROR",
    "ROUTE_LEARN"
  ];

  events.forEach(type => {
    bus.on(type, (event) => tapKernel(event));
  });

  console.log("🧠 KERNEL INTERFACE ACTIVE (READ-ONLY CONTROL SURFACE)");
}

module.exports = { attachKernelBridge };
