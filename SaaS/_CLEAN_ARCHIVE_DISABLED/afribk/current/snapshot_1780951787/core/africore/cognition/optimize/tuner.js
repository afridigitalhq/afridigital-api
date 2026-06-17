const fs = require("fs");

let stats = {
  success: 0,
  fail: 0
};

module.exports = {
  record(success) {
    success ? stats.success++ : stats.fail++;
  },

  getMode() {
    const ratio = stats.success / (stats.success + stats.fail + 1);

    if (ratio > 0.9) return "fast-path";
    if (ratio > 0.6) return "balanced";
    return "safe-mode";
  }
};
