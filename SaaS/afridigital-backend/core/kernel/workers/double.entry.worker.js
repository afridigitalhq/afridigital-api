
// DOUBLE ENTRY WORKER
const bus = require('../events/event.bus');

bus.on('ledger.transaction.posted', (tx) => {
  console.log('[DOUBLE ENTRY LEDGER] TX POSTED:', tx.txId);
});

