const { SOCAggregator } = require("../aggregator/soc.aggregator");
const aggregator = new SOCAggregator();

function tapEmit(event) {
  aggregator.ingest({
    type: "emit",
    source: "ci.spine",
    event
  });
}

module.exports = { tapEmit };
