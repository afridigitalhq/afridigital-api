const bus = require("../../core/kernel/events/event.bus");

function creditWallet(userId, amount) {
  broker.publish("wallet.credit.requested", { userId, amount });
  return { status: "queued" };
}

  return { status: "queued" };
}

function debitWallet(userId, amount) {
  broker.publish("wallet.debit.requested", { userId, amount });
  return { status: "queued" };
}

  return { status: "queued" };
}

module.exports = {
  creditWallet,
  debitWallet
};

