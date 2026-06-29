const { SOCAggregator } = require("../aggregator/soc.aggregator");
const aggregator = new SOCAggregator();

function tapDispatch(event) {
  aggregator.ingest({
    type: "dispatch",
    source: "SyscallGate",
    event
  });
}

module.exports = { tapDispatch, aggregator };
