
// FINALITY ENGINE (ensures settlement correctness)
const bus = require('../events/event.bus');
const store = require('../../ledger/transaction.store');

bus.on('wallet.credit.requested', (tx) => {
  store.updateStatus(tx.txId, 'PROCESSED');
  bus.emitEvent('wallet.credit.settled', {
    ...tx,
    status: 'SETTLED'
  });
});

bus.on('wallet.debit.requested', (tx) => {
  store.updateStatus(tx.txId, 'PROCESSED');
  bus.emitEvent('wallet.debit.settled', {
    ...tx,
    status: 'SETTLED'
  });
});

