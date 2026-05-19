const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {

  recommend(intent="general", user={}){

    const profile = user.profile || {};

    if(profile.business === "fashion"){

      return [
        "Fashion Affiliate Deals",
        "Open Fashion Store",
        "AI Product Promotion"
      ];
    }

    if(intent === "earning"){
      return [
        "Affiliate Offers",
        "AI Jobs",
        "Sell Digital Products"
      ];
    }

    if(intent === "commerce"){
      return [
        "Open Store",
        "Upload Products",
        "Merchant Dashboard"
      ];
    }

    return [
      "Open Dashboard",
      "Wallet",
      "Marketplace"
    ];
  }
};
