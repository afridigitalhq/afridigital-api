
// PROJECTION WORKER (recomputes balances continuously)
const bus = require('../events/event.bus');
const { calculateBalance } = require('../../ledger/wallet.projection');

bus.on('wallet.credit.requested', (event) => {
  const balance = calculateBalance(event.userId);
  console.log('[PROJECTION] credit processed balance:', balance);
});

bus.on('wallet.debit.requested', (event) => {
  const balance = calculateBalance(event.userId);
  console.log('[PROJECTION] debit processed balance:', balance);
});

