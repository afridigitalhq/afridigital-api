const bus = require("../../eventbus");

const walletDB = {};

/**
 * 🧠 Wallet reacts to system events
 */
bus.on("EARN", (data) => {

  walletDB[data.userId] =
    (walletDB[data.userId] || 0) + data.amount;
});

bus.on("SPEND", (data) => {

  walletDB[data.userId] =
    (walletDB[data.userId] || 0) - data.amount;
});

function getBalance(userId) {
  return walletDB[userId] || 0;
}

module.exports = { getBalance };
