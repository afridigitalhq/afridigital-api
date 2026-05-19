const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {

  select(intent="general", economy={}){

    const bank = {

      earning: [
        {
          title: "⭐ Affiliate Boost",
          body: "Earn commissions promoting digital products.",
          cta: "Start Earning"
        }
      ],

      commerce: [
        {
          title: "🚀 Store Upgrade",
          body: "Launch your storefront across Africa.",
          cta: "Open Store"
        }
      ],

      wallet: [
        {
          title: "💳 Wallet Pro",
          body: "Unlock faster transfers and smart payouts.",
          cta: "Upgrade Wallet"
        }
      ]
    };

    const pool = bank[intent] || [];

    if(!pool.length) return null;

    if(economy.level === "pro"){
      return {
        ...pool[0],
        premium: true
      };
    }

    return pool[0];
  }
};
