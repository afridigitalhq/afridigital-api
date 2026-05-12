
// DOUBLE ENTRY LEDGER CORE
const journal = require('./journal.engine');

function creditUser(userId, amount) {
  return journal.postJournal({
    txId: Date.now() + '-' + Math.random(),
    entries: [
      { account: 'user:' + userId, credit: amount },
      { account: 'system:liability', debit: amount }
    ]
  });
}

function debitUser(userId, amount) {
  return journal.postJournal({
    txId: Date.now() + '-' + Math.random(),
    entries: [
      { account: 'user:' + userId, debit: amount },
      { account: 'system:liability', credit: amount }
    ]
  });
}

module.exports = { creditUser, debitUser };

