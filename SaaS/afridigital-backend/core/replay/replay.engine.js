
// REPLAY ENGINE CORE
const log = require('../kafka/event.log');

function getOrderedEvents() {
  const all = log.read('wallet.events')
    .concat(log.read('ledger.events'))
    .concat(log.read('system.events'));

  return all.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

module.exports = { getOrderedEvents };

