const provider = require("../../providers/mockProvider");
const usage = require("../../saas/usage");

async function runRequest(req) {
  const apiKey = req.apiKey || "unknown";

  const count = usage.track(apiKey);

  const result = await provider.generate(req.text);

  return {
    text: result.text,
    usage: {
      apiKey,
      requests: count
    }
  };
}

module.exports = { runRequest };
