const { ingest } = require("./soc.websocket");

// kernel syscall tap bridge
function pushSyscall(event) {
  ingest({
    type: "dispatch",
    source: "SyscallGate",
    target: event?.target || "unknown",
    traceId: event?.traceId || null
  });
}

// spine emit tap bridge
function pushSpine(event) {
  ingest({
    type: "emit",
    source: "ci.spine",
    target: event?.target || null,
    traceId: event?.traceId || null
  });
}

module.exports = { pushSyscall, pushSpine };
