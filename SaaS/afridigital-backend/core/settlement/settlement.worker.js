const engine = require("./settlement.engine");

function startSettlementWorker(stream) {
  stream.subscribe((event) => {
    if (event.type === "transfer.request") {
      const tx = engine.createTransfer(event.payload);
      engine.validate(tx.id);
      engine.execute(tx.id);
      engine.finalize(tx.id);
    }
  });
}

module.exports = startSettlementWorker;
