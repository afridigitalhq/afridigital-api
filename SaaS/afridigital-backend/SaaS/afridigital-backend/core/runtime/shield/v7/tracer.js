const { addNode } = require("./graph.store");

function trace(event, data = {}) {
  addNode({
    event,
    data
  });
}

module.exports = { trace };
