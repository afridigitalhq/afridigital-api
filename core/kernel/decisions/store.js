// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { readLedger } = require("../event.ledger");

function buildDecisions() {
  const events = readLedger();

  const map = {};

  for (const e of events) {
    const key = e.type + ":" + (e.payload?.id || e.id);

    if (!map[key]) {
      map[key] = {
        type: e.type,
        source: e.source,
        status: "PENDING",
        quorum: 0,
        events: []
      };
    }

    map[key].events.push(e);

    if (e.type === "APPROVAL") map[key].quorum++;
    if (e.type === "REJECT") map[key].status = "REJECTED";
    if (map[key].quorum >= 2) map[key].status = "APPROVED";
  }

  return Object.values(map);
}

module.exports = { buildDecisions };
