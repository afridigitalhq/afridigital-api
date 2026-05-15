/**
 * 🔁 A3.18.14 EVOLUTION PROPOSAL ENGINE
 * AI suggests improvements (NOT auto-applied)
 */

function generateProposal(scoreData) {

  if (scoreData.label === "BAD") {
    return {
      type: "EVOLUTION_PROPOSAL",
      suggestion: "Improve response quality patterns",
      reason: "Low scoring messages detected",
      impact: "HIGH",
      status: "PENDING_ADMIN_APPROVAL"
    };
  }

  return null;
}

module.exports = { generateProposal };
