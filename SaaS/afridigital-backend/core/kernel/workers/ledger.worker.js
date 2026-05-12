
// LEDGER WORKER (event processor)
const bus = require('../events/event.bus');
const { appendEvent } = require('../../ledger/wallet.ledger');

bus.on('wallet.credit.requested', (event) => {
  appendEvent({ type: 'CREDIT', ...event });
});

bus.on('wallet.debit.requested', (event) => {
  appendEvent({ type: 'DEBIT', ...event });
});

