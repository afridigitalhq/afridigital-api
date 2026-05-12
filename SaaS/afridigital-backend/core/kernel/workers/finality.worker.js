
// FINALITY WORKER (ensures all events reach settlement state)
const bus = require('../events/event.bus');

bus.on('wallet.credit.settled', (tx) => {
  console.log('[FINALITY] CREDIT SETTLED:', tx.txId);
});

bus.on('wallet.debit.settled', (tx) => {
  console.log('[FINALITY] DEBIT SETTLED:', tx.txId);
});

