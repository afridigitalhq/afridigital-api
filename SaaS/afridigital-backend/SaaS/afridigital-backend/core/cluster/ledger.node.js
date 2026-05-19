
// LEDGER NODE (cluster execution unit)
const bus = require('../kernel/events/event.bus');
const lock = require('./consensus.lock');

bus.on('ledger.transaction.posted', (tx) => {
  const ok = lock.acquireLock(tx.userId);

  if (!ok) {
    console.log('[CLUSTER] LOCKED - retry queued:', tx.txId);
    return;
  }

  console.log('[CLUSTER NODE] processing tx:', tx.txId);

  setTimeout(() => {
    lock.releaseLock(tx.userId);
  }, 10);
});

