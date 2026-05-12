/**
 * AfriDigital Kernel Runtime State
 * Central safe runtime memory for execution tracking
 */

const runtimeResponse = {
  status: "BOOTING",
  success: true,

  request: null,
  response: null,

  context: {
    user: null,
    session: null,
    channel: null,
  },

  trace: [],
  errors: [],

  metrics: {
    startTime: Date.now(),
    latency: 0,
  },
};

const runtimeFlags = {
  simulationMode: false,
  debug: false,
  safeMode: true,
};

const runtimeContext = {
  kernelVersion: "V8.20",
  environment: process.env.NODE_ENV || "production",
};

function initRuntimeKernel() {
  global.runtimeResponse = runtimeResponse;
  global.runtimeFlags = runtimeFlags;
  global.runtimeContext = runtimeContext;

  runtimeResponse.status = "READY";
  runtimeResponse.metrics.startTime = Date.now();
}

function updateRuntime(partial = {}) {
  global.runtimeResponse = {
    ...global.runtimeResponse,
    ...partial,
  };
}

module.exports = {
  runtimeResponse,
  runtimeFlags,
  runtimeContext,
  initRuntimeKernel,
  updateRuntime,
};

