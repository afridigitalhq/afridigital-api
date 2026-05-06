const memoryStore = [];

function embed(text) {
  // placeholder embedding (swap with OpenAI / local model later)
  return text.toLowerCase().split(" ").map(w => w.length);
}

function similarity(a, b) {
  const min = Math.min(a.length, b.length);
  let score = 0;
  for (let i = 0; i < min; i++) score += Math.min(a[i], b[i]);
  return score;
}

async function storeMemory({ userId, message, response, channel }) {
  const vector = embed(message);
  memoryStore.push({ userId, message, response, channel, vector, ts: Date.now() });
  return true;
}

async function recallMemory({ userId, message }) {
  const queryVector = embed(message);

  let best = null;
  let bestScore = 0;

  for (const m of memoryStore) {
    if (m.userId !== userId) continue;
    const score = similarity(queryVector, m.vector);
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }

  return best;
}

module.exports = { storeMemory, recallMemory };
