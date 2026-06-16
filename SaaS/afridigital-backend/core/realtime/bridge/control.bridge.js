/**
 * 🌐 CONTROL TOWER BRIDGE
 * Sends SCAN results to React UI only
 */

const EventEmitter = require("events");
const stream = new EventEmitter();

function emitScan(data) {
  stream.emit("scan", {
    type: "execution_compiler_scan",
    ts: Date.now(),
    data
  });
}

function onScan(fn) {
  stream.on("scan", fn);
}

module.exports = {
  emitScan,
  onScan
};
