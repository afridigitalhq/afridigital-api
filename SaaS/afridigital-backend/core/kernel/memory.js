const memory = new Map();

function write(traceId, data) {
  memory.set(traceId, {
    ...(memory.get(traceId) || {}),
    ...data,
    updatedAt: Date.now()
  });
}

function read(traceId) {
  return memory.get(traceId);
}

module.exports = { write, read };
