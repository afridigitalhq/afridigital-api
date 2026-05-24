const memory = new Map();

function updateMemory(userId, data) {

  const existing = memory.get(userId) || {};

  memory.set(userId, {
    ...existing,
    ...data
  });

  return memory.get(userId);
}

function getMemory(userId) {
  return memory.get(userId) || {};
}

module.exports = { updateMemory, getMemory };
