/**
 * 🧠 AI OS KERNEL INTERFACE LAYER
 * READ-ONLY CONTROL SURFACE
 */

const bus = require('../../africore/runtime/event.bus');
const timeline = require('../timeline/time.engine');

const kernelState = {
  mode: "observability",
  locked: false,
  lastEvent: null
};

/**
 * Safe kernel event tap (no mutation)
 */
function tapKernel(event) {
  kernelState.lastEvent = event;

  timeline.recordEvent({
    type: event.type,
    traceId: event.traceId,
    payload: event.payload
  });

  bus.emitEvent({
    type: "KERNEL_TAP",
    stage: "mirror",
    traceId: event.traceId || "system",
    payload: event
  });
}

/**
 * Kernel mode switch (restricted)
 */
function setKernelMode(mode) {
  const allowed = ["observability", "diagnostic", "replay"];

  if (!allowed.includes(mode)) {
    return { error: "MODE_NOT_ALLOWED" };
  }

  kernelState.mode = mode;

  bus.emitEvent({
    type: "KERNEL_MODE",
    stage: "update",
    traceId: "system",
    payload: { mode }
  });

  return kernelState;
}

/**
 * Read-only snapshot of kernel
 */
function getKernelState() {
  return {
    ...kernelState,
    timelineSize: timeline._timeline.length
  };
}

module.exports = {
  tapKernel,
  setKernelMode,
  getKernelState
};
