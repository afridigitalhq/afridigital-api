const ollama = require('../providers/ollamaProvider');
const openai = require('../providers/openaiProvider');
const mock = require('../providers/mockProvider');

const providers = {
  ollama,
  openai,
  mock
};

function getProvider(name) {
  return providers[name] || providers.ollama;
}

function listProviders() {
  return Object.keys(providers);
}

module.exports = { getProvider, listProviders };
