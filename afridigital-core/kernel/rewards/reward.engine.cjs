const bus = require("../events/event.spine.cjs");
const wallet = require("../wallet/wallet.engine.cjs");

console.log("\n💰 REWARD ENGINE ACTIVE\n");

bus.on("AD_CLICKED", (e) => {
  wallet.credit(e.userId, 1);
  console.log("💸 Reward issued:", e.userId);
});

bus.on("CHAT_ACTIVE_TIME", (e) => {
  if (e.minutes > 3) wallet.credit(e.userId, 0.5);
});
