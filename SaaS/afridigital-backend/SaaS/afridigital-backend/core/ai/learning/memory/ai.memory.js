/**
 * 🧠 A3.18.14 AI MEMORY STORE
 * Stores best and worst responses
 */

const memory = [];

function storeMemory(entry) {
  memory.push({
    ...entry,
    ts: Date.now()
  });

  if (memory.length > 5000) memory.shift();
}

function getMemory() {
  return memory;
}

module.exports = { storeMemory, getMemory };
