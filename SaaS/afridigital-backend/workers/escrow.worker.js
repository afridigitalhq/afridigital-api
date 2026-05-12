/**
 * ⏳ Auto Escrow Processor
 */

const escrow = require('../core/escrow.engine');

function runEscrowCycle() {

  console.log("🔄 Running escrow cycle...");

  const updated = escrow.autoRelease();

  console.log("✅ Escrow checked:", updated.length);

}

setInterval(runEscrowCycle, 60 * 1000);

module.exports = runEscrowCycle;
