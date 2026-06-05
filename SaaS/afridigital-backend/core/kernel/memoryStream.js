const store = new Map();

function createMemoryStream() {

  function write(traceId, data) {
    store.set(traceId, {
      ...(store.get(traceId) || {}),
      ...data,
      updatedAt: Date.now()
    });
  }

  function read(traceId) {
    return store.get(traceId);
  }

  return { write, read };
}

module.exports = { createMemoryStream };
