function createFailover(registry) {

  function selectNode() {
    const nodes = registry.listNodes();
    return nodes[Math.floor(Math.random() * nodes.length)];
  }

  return { selectNode };
}

module.exports = { createFailover };
