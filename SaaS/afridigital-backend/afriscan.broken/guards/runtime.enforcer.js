const scan = require("./layer.scanner");

function enforce() {
  const report = scan();

  if (!report.ok) {
    throw new Error(
      "AFRISCAN_LAYER_VIOLATION: " +
      JSON.stringify(report.violations, null, 2)
    );
  }

  return true;
}

module.exports = enforce;
