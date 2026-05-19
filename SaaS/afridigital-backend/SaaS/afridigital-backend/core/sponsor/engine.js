const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {
  inject(intent = "general") {

    const ads = {
      earning: {
        title: "⭐ Sponsored Opportunity",
        body: "Promote digital products and earn commissions daily.",
        buttons: ["View Offers", "Start Earning"]
      },

      commerce: {
        title: "🚀 Merchant Boost",
        body: "Open your storefront and start selling across Africa.",
        buttons: ["Open Store", "Learn More"]
      },

      wallet: {
        title: "⚡ Wallet Upgrade",
        body: "Enable faster transfers and advanced wallet tools.",
        buttons: ["Activate Wallet", "Skip"]
      },

      payment: {
        title: "💳 Secure Payments",
        body: "Use transaction PIN protection for safer transfers.",
        buttons: ["Enable Protection", "Skip"]
      },

      general: null
    };

    return ads[intent] || null;
  }
};
