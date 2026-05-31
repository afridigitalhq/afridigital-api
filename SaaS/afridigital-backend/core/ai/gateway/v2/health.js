const scores = {
  mock: 1.0,
  ollama: 0.7,
  openai: 0.5
};

function getHealth(name) {
  return scores[name] || 0.3;
}

module.exports = { getHealth };
