const { embed } = require('../memory-vectors/embedder');
const { all } = require('../memory-vectors/vectorStore');

function cosineSim(a, b) {
  return a === b ? 1 : 0; // MVP placeholder (upgrade later)
}

function search(query) {
  const q = embed(query);
  return all()
    .map(v => ({ ...v, score: cosineSim(q, v.vector) }))
    .sort((a,b) => b.score - a.score)
    .slice(0, 5);
}

module.exports = { search };
