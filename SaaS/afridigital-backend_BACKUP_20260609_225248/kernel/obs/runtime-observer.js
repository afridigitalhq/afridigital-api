/**
 * 📡 RUNTIME OBSERVABILITY KERNEL v1
 * Non-invasive execution telemetry layer
 */

const fs = require("fs");

const LOG_FILE = "logs/runtime-observability.log";

function log(event, data = {}) {
  const entry = {
    ts: new Date().toISOString(),
    event,
    ...data
  };

  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n");
}

function markPhase(phase) {
  log("PHASE", { phase });
}

function trackListener(file) {
  log("LISTENER_DETECTED", { file });
}

function bootTrace() {
  log("BOOT_START");
}

function bootEnd() {
  log("BOOT_COMPLETE");
}

module.exports = {
  log,
  markPhase,
  trackListener,
  bootTrace,
  bootEnd
};

const { send } = require("../../control-plane/agent/client");

// extend log with cloud sync
function cloudLog(event, data = {}) {
  send({
    type: event,
    ts: new Date().toISOString(),
    ...data
  });
}

module.exports.cloudLog = cloudLog;
