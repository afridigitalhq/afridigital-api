function routeConversion(score, message) {
  if (score > 0.7) {
    return {
      action: "PAYMENT_FLOW",
      lane: "wa:outbox",
      crmTag: "hot_lead"
    };
  }

  if (score > 0.4) {
    return {
      action: "NURTURE",
      lane: "wa:delay",
      crmTag: "warm_lead"
    };
  }

  return {
    action: "EDUCATE",
    lane: "wa:delay",
    crmTag: "cold_lead"
  };
}

module.exports = { routeConversion };
