const { assertApiVersion } = require("../runtime/safety/api.guard");
const memory = require("../../core/memory/engine");
const personality = require("../../core/personality/engine");
const economy = require("../../core/economy/engine");
const ranking = require("../../core/ranking/engine");
const recommendation = require("../../core/recommendation/engine");

function classify(text=""){

  text = text.toLowerCase();

  if(text.includes("earn")) return "earning";
  if(text.includes("sell")) return "commerce";
  if(text.includes("wallet")) return "wallet";
  if(text.includes("pay")) return "payment";
  if(text.includes("help")) return "support";

  return "general";
}

module.exports = {

  async process({ from, message }) {

    const intent = classify(message);

    let user = memory.get(from);

    memory.pushActivity(from,intent);

    user = memory.get(from);

    user.economy = economy.build(user);

    memory.save(from,user);

    const reply =
      personality.tone(intent);

    const recommendations =
      recommendation.recommend(intent,user);

    const sponsored =
      ranking.select(intent,user.economy);

    console.log("🧠 USER:", from);
    console.log("📊 ECONOMY:", user.economy);

    return {

      intent,

      reply,

      profile: user.profile,

      economy: user.economy,

      recommendations,

      sponsored
    };
  }
};
