const { runWithFallback } = require("./router");
const { track } = require("./usage");

async function runRequest(req) {
  const apiKey = req.apiKey || "public";

  track(apiKey);

  const res = await runWithFallback(req.text || "");

  return {
    text: res.result.text,
    provider: res.provider,
    usageKey: apiKey
  };
}

module.exports = { runRequest };
