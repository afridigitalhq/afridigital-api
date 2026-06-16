const run = require("../pipeline.js");
const guard = require('./runtime.guard');

module.exports = function audit() {
  const result = run();
  const check = guard(result);

  return {
    ok: check.valid && typeof result === 'object',
    score: result.score || 0,
    state: result.state || 'UNKNOWN',
    violations: check.violations
  };
};
