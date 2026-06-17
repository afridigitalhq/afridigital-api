const mock = require('./providers/mock');
const ollama = require('./providers/ollama');
const openai = require('./providers/openai');
const { getHealth } = require('./health');

function selectProvider() {
  const list = [
    { name: "ollama", provider: ollama },
    { name: "openai", provider: openai },
    { name: "mock", provider: mock }
  ];

  list.sort((a, b) => getHealth(b.name) - getHealth(a.name));

  return list[0]?.provider || mock;
}

module.exports = { selectProvider };
