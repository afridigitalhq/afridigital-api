const bus = require("../events/event.bus");

bus.onEvent("wallet.credit.requested", async ({ payload }) => {
  const { userId, amount } = payload;

  console.log("💰 CREDIT PROCESS:", userId, amount);

  // TODO: DB update here
});

bus.onEvent("wallet.debit.requested", async ({ payload }) => {
  const { userId, amount } = payload;

  console.log("💸 DEBIT PROCESS:", userId, amount);

  // TODO: DB validation + deduction
});

