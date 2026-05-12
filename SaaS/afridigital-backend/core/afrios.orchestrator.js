const { assertApiVersion } = require("../runtime/safety/api.guard");
const AfriAIAgent = require('../services/afriai.agent');
const { getRandomAd, buildAdCard } = require('../services/ad.engine');
const { addPoints } = require('../services/wallet.engine');

async function AfriOS(message, from) {

  const text = (message || "").toLowerCase();

  const adKeywords = ["earn", "money", "job", "work", "income", "online"];
  const triggerAd = adKeywords.some(k => text.includes(k));

  // 📦 AD CARD MODE
  if (triggerAd) {
    const ad = getRandomAd();
    const cardText = buildAdCard(ad);

    const balance = addPoints(from, 5, "ad_trigger");

    return {
      type: "card",
      reply: cardText + `\n💰 Wallet: ${balance} pts`,
      url: ad.url
    };
  }

  // 🧠 AI MODE
  const aiReply = await AfriAIAgent(message, from);

  return {
    type: "ai",
    reply: aiReply
  };
}

module.exports = AfriOS;
