
// DOUBLE ENTRY JOURNAL ENGINE
const bus = require('../kernel/events/event.bus');
const accounts = require('./accounts.registry');

function postJournal({ txId, entries }) {
  entries.forEach(e => {
    accounts.applyEntry(e);
  });

  bus.emitEvent('ledger.transaction.posted', {
    txId,
    entries
  });
}

module.exports = { postJournal };

