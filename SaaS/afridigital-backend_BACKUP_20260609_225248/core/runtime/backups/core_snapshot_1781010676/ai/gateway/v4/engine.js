const router = require('./router');
const providers = {
  ollama: require('../../providers/ollamaProvider'),
  mock: require('../../providers/mockProvider'),
  openai: require('../../providers/openaiProvider')
};

async function execute({ text, streamId, auto = true, provider }) {
  const chosen = router.select(auto, provider);

  const selectedProvider = providers[chosen];

  if (!selectedProvider) throw new Error("Provider missing");

  // return chosen provider so v5 can use it
  return chosen;
}

module.exports = { execute };
