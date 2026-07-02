function generateSuggestions(imbalances) {

  return imbalances.map(i => {

    if (i.type === "UNDER_SUPPLIED") {
      return {
        category: i.category,
        suggestion: "Create more jobs/services in this category",
        action: "USER_CREATE_OPPORTUNITY_TEMPLATE",
        priority: "HIGH"
      };
    }

    if (i.type === "OVER_SUPPLIED") {
      return {
        category: i.category,
        suggestion: "Boost visibility or reduce supply pressure",
        action: "BOOST_MARKETPLACE_LISTING",
        priority: "MEDIUM"
      };
    }

  }).filter(Boolean);
}
