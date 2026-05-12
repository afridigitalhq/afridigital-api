
// EVENT REPLICATOR (cluster sync layer)
const bus = require('../kernel/events/event.bus');

const peers = []; // future: node registry

function broadcast(event) {
  peers.forEach(node => {
    node.receive(event);
  });
}

bus.onAny = function(eventName, payload) {
  broadcast({ eventName, payload });
};

module.exports = { broadcast };

