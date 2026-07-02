const { subscribe } = require("../../events/event.bus.cjs");

const balances = new Map();

subscribe("REWARD_CREDIT", (data) => {
  const current = balances.get(data.userId) || 0;
  balances.set(data.userId, current + data.amount);
});

subscribe("PAYMENT_DEBIT", (data) => {
  const current = balances.get(data.userId) || 0;
  balances.set(data.userId, Math.max(0, current - data.amount));
});

module.exports = balances;
