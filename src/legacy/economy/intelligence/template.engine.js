function generateOpportunityTemplates(analysis) {

  const templates = [];

  if (analysis.imbalance === "EARN_SUPPLY_LOW") {
    templates.push({
      type: "EARN_TEMPLATE_SUGGESTION",
      title: "Micro-task Campaign Opportunity",
      description: "Users are searching earn tasks faster than supply",
      action: "Create real earn task via admin approval"
    });
  }

  if (analysis.imbalance === "SERVICE_SHORTAGE") {
    templates.push({
      type: "SERVICE_TEMPLATE_SUGGESTION",
      title: "Service Expansion Opportunity",
      description: "Demand exceeds available service providers",
      action: "Invite providers or enable onboarding flow"
    });
  }

  return templates;
}

module.exports = { generateOpportunityTemplates };
