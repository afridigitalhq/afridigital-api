function createLedgerEntry(type, data) {

  return {
    type,
    data,
    timestamp: Date.now()
  };
}

module.exports = { createLedgerEntry };
