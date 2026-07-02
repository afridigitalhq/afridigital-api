const bus = require("../../eventbus");

function detectGaps(analysis) {

  const insights = [];

  if (analysis.imbalance === "EARN_SUPPLY_LOW") {
    insights.push({
      type: "INSIGHT",
      severity: "HIGH",
      message: "Low earn task availability compared to job demand",
      recommendation: "Increase real earn task postings"
    });
  }

  if (analysis.imbalance === "SERVICE_SHORTAGE") {
    insights.push({
      type: "INSIGHT",
      severity: "MEDIUM",
      message: "Service marketplace underrepresented",
      recommendation: "Encourage service providers onboarding"
    });
  }

  bus.emit("ECONOMY_INSIGHTS", insights);

  return insights;
}

module.exports = { detectGaps };
