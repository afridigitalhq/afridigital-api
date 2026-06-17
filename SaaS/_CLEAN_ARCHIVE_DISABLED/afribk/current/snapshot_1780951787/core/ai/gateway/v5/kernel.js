const { selectProvider } = require("./registry");
const { normalizeProvider } = require("./adapter");
const usage = require("./usage/store");

async function run(req) {
  const provider = normalizeProvider(selectProvider(req));

  let output = await provider.generate(req.text || "");

  const response = {
    text: output?.text || output || "[EMPTY]",
    provider: provider.name || "mock",
    usageKey: req.apiKey || "public"
  };

  usage.track(req.apiKey || "public", response);

  return response;
}

module.exports = { run };
