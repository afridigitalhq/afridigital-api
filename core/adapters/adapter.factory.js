function createAdapter(name, handler) {
  return {
    name,
    handle: handler
  };
}

module.exports = { createAdapter };
