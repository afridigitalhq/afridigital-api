
// TRANSACTION STORE (in-memory + file fallback)
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'transactions.json');

function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function create(tx) {
  const txs = load();
  txs.push(tx);
  save(txs);
  return tx;
}

function updateStatus(txId, status) {
  const txs = load();
  const updated = txs.map(tx =>
    tx.txId === txId ? { ...tx, status } : tx
  );
  save(updated);
  return updated.find(t => t.txId === txId);
}

module.exports = { create, updateStatus, load };

