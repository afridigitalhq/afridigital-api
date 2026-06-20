const fraudEngine = require("../afridigital-core/kernel/fraud/fraud.engine.cjs");

async function analyzeMessage(text, from) {
  return await fraudEngine.analyze({
    event: text,
    payload: { user: from }
  });
}

module.exports = { analyzeMessage };
