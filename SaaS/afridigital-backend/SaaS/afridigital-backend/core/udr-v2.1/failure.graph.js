console.log('🧠 UDR v2.1 FAILURE GRAPH ENGINE ACTIVE');

const graph = {
  nodes: [],
  edges: []
};

function classify(errorMessage = '') {
  if (errorMessage.includes('MODULE_NOT_FOUND')) {
    return 'MISSING_MODULE';
  }

  if (errorMessage.includes('Cannot read')) {
    return 'NULL_REFERENCE';
  }

  if (errorMessage.includes('ECONNREFUSED')) {
    return 'CONNECTION_FAILURE';
  }

  return 'UNKNOWN_FAILURE';
}

function addFailure(moduleId, error) {
  const type = classify(error.message || error);

  const node = {
    id: moduleId,
    type,
    error: error.message || error,
    ts: Date.now()
  };

  graph.nodes.push(node);

  return node;
}

module.exports = { graph, classify, addFailure };
