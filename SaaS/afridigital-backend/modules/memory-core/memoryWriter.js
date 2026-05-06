const { embed } = require('../memory-vectors/embedder');
const { save } = require('../memory-vectors/vectorStore');

function writeMemory({ userId, text, meta }) {
  save({
    userId,
    text,
    vector: embed(text),
    meta,
    timestamp: Date.now()
  });
}

module.exports = { writeMemory };
