const bus = require("../../spine/event-bus");
const EVENTS = require("../../contracts/events");

const balances = {};

bus.on(EVENTS.WALLET_TOPUP, (data) => {
  balances[data.user] = (balances[data.user] || 0) + data.amount;
  console.log("💰 WALLET TOPUP:", balances[data.user]);
});
