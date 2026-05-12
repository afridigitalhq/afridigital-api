const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {

  tone(intent="general"){

    const map = {

      earning: [
        "🔥 Here are smart earning options for you 👇",
        "💸 These opportunities fit your profile 👇"
      ],

      commerce: [
        "🛍️ Your business tools are ready 👇",
        "🚀 Let’s grow your business 👇"
      ],

      wallet: [
        "💳 Wallet actions available 👇",
        "⚡ Your wallet tools are ready 👇"
      ],

      payment: [
        "🔐 Secure payment flow initialized 👇"
      ],

      support: [
        "🛟 Support options ready 👇"
      ],

      general: [
        "🧠 AfriDigital AI Assistant ready 👇"
      ]
    };

    const arr = map[intent] || map.general;

    return arr[Math.floor(Math.random()*arr.length)];
  }
};
