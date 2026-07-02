const fs = require("fs");
const path = require("path");
const bus = require('../eventbus');

function file(userId) {
  return path.join(__dirname, "../../data/users", userId, "wallet.json");
}

function ensure(userId) {
  const dir = path.dirname(file(userId));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(file(userId))) {
    fs.writeFileSync(file(userId), JSON.stringify({
      balance: 0,
      transactions: []
    }, null, 2));
  }
}

function read(userId) {
  ensure(userId);
  return JSON.parse(fs.readFileSync(file(userId)));
}

function write(userId, data) {
  fs.writeFileSync(file(userId), JSON.stringify(data, null, 2));
}

function credit(userId, amount) {
  const wallet = read(userId);

  wallet.balance += amount;
  wallet.transactions.push({
    type: "CREDIT",
    amount,
    timestamp: Date.now()
  });

  write(userId, wallet);

  bus.emit("WALLET_UPDATED", { userId, wallet });

  return wallet;
}

function debit(userId, amount) {
  const wallet = read(userId);

  wallet.balance -= amount;
  wallet.transactions.push({
    type: "DEBIT",
    amount,
    timestamp: Date.now()
  });

  write(userId, wallet);

  bus.emit("WALLET_UPDATED", { userId, wallet });

  return wallet;
}

module.exports = { read, credit, debit };
