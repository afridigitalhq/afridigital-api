const fraud = require("../../afridigital-core/kernel/fraud/fraud.engine.cjs");

async function analyze(payload) {
  return fraud.analyze(payload);
}

module.exports = { analyze };
