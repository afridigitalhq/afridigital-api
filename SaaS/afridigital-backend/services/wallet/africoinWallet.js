const bus = require("../../core/kernel/events/event.bus");

function creditWallet(userId, amount) {
  bus.emitEvent("wallet.credit.requested", { userId, amount });
  return { status: "queued" };
}

  return { status: "queued" };
}

function debitWallet(userId, amount) {
  bus.emitEvent("wallet.debit.requested", { userId, amount });
  return { status: "queued" };
}

  return { status: "queued" };
}

module.exports = {
  creditWallet,
  debitWallet
};

