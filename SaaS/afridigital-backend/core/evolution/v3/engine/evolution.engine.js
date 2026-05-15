/**
 * 🧠 A3.15 EVOLUTION ENGINE CORE
 * Full governed AI self-improvement pipeline
 */

const { generateProposal } = require("../generator/proposal.engine");
const { buildDiff } = require("../diff/diff.engine");
const { pushSnapshot } = require("../ledger/ledger.engine");
const { watchdogFilter } = require("../watchdog/evolution.watchdog");
const { addProposal } = require("../queue/evolution.queue");

function runEvolutionCycle() {

  const proposal = generateProposal();

  const guard = watchdogFilter(proposal);

  if (!guard.allow) {
    return {
      status: "BLOCKED",
      reason: guard.reason
    };
  }

  const diff = buildDiff(
    proposal.diffHint?.before,
    proposal.diffHint?.after
  );

  const enriched = {
    ...proposal,
    diff
  };

  addProposal(enriched);
  pushSnapshot(enriched);

  return {
    status: "QUEUED",
    proposal: enriched
  };
}

module.exports = { runEvolutionCycle };
