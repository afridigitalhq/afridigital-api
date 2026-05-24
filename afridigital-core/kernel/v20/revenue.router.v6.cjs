function routeByRevenue(score) {

  if (score > 0.75) {
    return {
      lane: "wa:outbox",
      action: "CLOSE_SALE",
      priority: "HIGH"
    };
  }

  if (score > 0.4) {
    return {
      lane: "wa:delay",
      action: "NURTURE_LEAD",
      priority: "MEDIUM"
    };
  }

  return {
    lane: "wa:content",
    action: "EDUCATE",
    priority: "LOW"
  };
}

module.exports = { routeByRevenue };
