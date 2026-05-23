function generateOffer(customerType) {
  if (customerType === "HOT") {
    return "🔥 Limited offer: 20% discount if you subscribe today. Want the payment link?";
  }

  if (customerType === "WARM") {
    return "👍 We have affordable plans starting from low cost. Want details?";
  }

  return "😊 Let me know what you're looking for and I'll recommend the best plan.";
}

module.exports = { generateOffer };
