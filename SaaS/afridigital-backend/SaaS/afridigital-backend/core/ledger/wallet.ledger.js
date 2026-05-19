
// WALLET LEDGER (append-only source of truth)
const fs = require('fs');
const path = require('path');

const LEDGER_FILE = path.join(__dirname, 'wallet.ledger.json');

function appendEvent(event) {
  const ledger = fs.existsSync(LEDGER_FILE)
    ? JSON.parse(fs.readFileSync(LEDGER_FILE))
    : [];

  ledger.push({
    id: Date.now() + '-' + Math.random(),
    ...event,
    timestamp: new Date().toISOString()
  });

  fs.writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 2));
  return event;
}

module.exports = { appendEvent };

