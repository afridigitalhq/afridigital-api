const broker = require("../../eventlog/broker");

function attachKafkaBridge() {
  broker.subscribe("wallet.credit.requested", (event) => {
    global.realtime?.broadcast(event);
  });

  broker.subscribe("wallet.debit.requested", (event) => {
    global.realtime?.broadcast(event);
  });
}

module.exports = { attachKafkaBridge };
