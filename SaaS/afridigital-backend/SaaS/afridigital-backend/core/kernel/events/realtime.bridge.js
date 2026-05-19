function attachRealtime(bus) {
  bus.on("wallet.credit.requested", (event) => {
    global.realtime?.broadcast(event);
  });

  bus.on("wallet.debit.requested", (event) => {
    global.realtime?.broadcast(event);
  });
}

module.exports = { attachRealtime };
