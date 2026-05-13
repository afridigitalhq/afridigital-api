const router = require("../router/event.router");

class WalletSync {
  constructor(io) {
    this.io = io;

    router.subscribe("wallet", (event) => {
      this.io?.emit("wallet:event", event);
    });
  }
}

module.exports = WalletSync;
