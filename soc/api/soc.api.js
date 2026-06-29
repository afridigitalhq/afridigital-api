const { SOCMaster } = require("../engine/soc.master");
const soc = new SOCMaster();

// global ingestion buffer (taps push here)
function ingest(event) {
  soc.ingest(event);
}

function snapshot() {
  return soc.snapshot();
}

module.exports = { ingest, snapshot };
