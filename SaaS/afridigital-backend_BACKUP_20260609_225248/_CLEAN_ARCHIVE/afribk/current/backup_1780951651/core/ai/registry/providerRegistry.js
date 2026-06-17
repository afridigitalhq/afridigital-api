const Ollama = require("../providers/ollamaProvider");
const OpenAI = require("../providers/openaiProvider");
const Mock = require("../providers/mockProvider");

const providers = {
  ollama: new Ollama(),
  openai: new OpenAI(),
  mock: new Mock()
};

function get(name) {
  return providers[name] || providers.mock;
}

module.exports = { get };
