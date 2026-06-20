const { aiOrchestrator } = require("../ai/orchestrator");

async function handleMessage(req, res) {

  const { message } = req.body;

  const result = await aiOrchestrator(message, {
    traceId: req.body.traceId,
    jobs: [],
    services: [],
    earn: [],
    marketplace: {}
  });

  return res.json(result);
}

module.exports = { handleMessage };
