const router = require("../../core/commerce/router");

module.exports = {

  async process({ from, message }) {

    console.log("📩 Incoming:", from, message);

    const result = router.route(from, message);

    let reply = "🧠 AfriDigital AI Assistant";

    if(result.intent === "earning") {
      reply = "Here are earning opportunities for you 👇";
    }

    if(result.intent === "wallet") {
      reply = "Wallet tools ready 👇";
    }

    if(result.intent === "commerce") {
      reply = "Business tools available 👇";
    }

    if(result.intent === "payment") {
      reply = "Payment flow initialized 👇";
    }

    return {
      reply,
      actions: result.actions,
      sponsored: result.sponsored
    };
  }
};
