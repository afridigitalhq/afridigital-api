const run = require("../pipeline.js");
const guard = require('./architecture.guard');

module.exports = function audit() {
  const result = run();
  const check = guard();

  return {
    score: result.score,
    state: result.state,
    uptime: result.uptime,
    infra: result.infra,
    db: result.db,
    meta: result.meta,
    snapshots: result.snapshots,
    telemetry: result.telemetry,
    architecture: check
  };
};
