const { systemInspector } = require("./systemInspector");

function healthDashboard() {
  const sys = systemInspector();

  let score = 0;
  let total = 7;

  const checks = [
    sys.backend,
    sys.kernel_v7,
    sys.queue,
    sys.watchdog,
    sys.recovery,
    sys.observe,
    sys.sender
  ];

  checks.forEach(v => v && score++);

  return {
    status: score === total ? "HEALTHY" : "DEGRADED",
    score,
    total,
    system: sys
  };
}

module.exports = { healthDashboard };
