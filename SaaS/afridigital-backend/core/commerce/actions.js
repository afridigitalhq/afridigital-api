const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {
  get(intent = "general") {

    const map = {

      earning: [
        "Sell Products",
        "Affiliate Offers",
        "AI Jobs",
        "Open Dashboard"
      ],

      commerce: [
        "Open Store",
        "Upload Product",
        "View Orders",
        "Business Dashboard"
      ],

      wallet: [
        "Send Money",
        "Wallet Balance",
        "Transaction History",
        "Open Dashboard"
      ],

      payment: [
        "Confirm Payment",
        "Cancel Payment",
        "Contact Support"
      ],

      support: [
        "Customer Care",
        "Talk To Agent",
        "Open Ticket"
      ],

      general: [
        "Open Dashboard",
        "AI Assistant",
        "Marketplace",
        "Wallet"
      ]
    };

    return map[intent] || map.general;
  }
};
