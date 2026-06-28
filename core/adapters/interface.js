function createAdapter(name, handler) {
  return {
    name,
    handle: handler,
    type: "ADAPTER"
  };
}

module.exports = { createAdapter };
