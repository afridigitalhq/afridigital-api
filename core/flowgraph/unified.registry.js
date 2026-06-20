const { adapt } = require('./node.adapter');

const orchestrator = require('../ai/orchestrator');
const bridge = require('../ai/bridge/module.resolver');
const flowgraph = require('../ui/flowgraph-stream');

const registry = {
  orchestrator: adapt('orchestrator', orchestrator),
  bridge: adapt('bridge', bridge),
  flowgraph: adapt('flowgraph', flowgraph)
};

function getNode(name) {
  return registry[name];
}

function listNodes() {
  return Object.keys(registry);
}

module.exports = {
  registry,
  getNode,
  listNodes
};
