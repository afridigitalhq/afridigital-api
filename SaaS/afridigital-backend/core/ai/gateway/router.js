const ollama = require('../providers/ollamaProvider');
const mock = require('../providers/mockProvider');

function selectProvider(name) {
  switch (name) {
    case "mock": return mock;
    case "ollama": return ollama;
    default: return mock;
  }
}

module.exports = { selectProvider };
