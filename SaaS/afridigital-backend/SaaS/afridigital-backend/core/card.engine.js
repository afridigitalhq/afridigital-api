const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS v1.4.2 CARD ENGINE (BRAND ALIGNMENT FIX)
 * - AfriWork = jobs / remote work
 * - AfriBoost = ads / promotion
 * - NO internal system branding in UI
 * - Reward always clean numeric
 */

function buildCard({ title, description, cta, reward }) {

  return `
${title}

${description}

${cta}

💰 Reward: ${reward} Africoin
`.trim();
}

// 💼 WORK FROM HOME (FIXED)
function workCard(ad) {

  return buildCard({
    title: "💼 AfriWork Opportunity",
    description: "Remote work opportunities powered by AfriWork",
    cta: "👉 💼 Apply for Opportunity",
    reward: ad.reward
  });
}

// 📣 BOOST ADS
function boostCard(ad) {

  return buildCard({
    title: "📣 AfriBoost Campaign",
    description: ad.description,
    cta: "👉 🚀 Start Campaign",
    reward: ad.reward
  });
}

// 💰 WALLET
function walletCard(balance, currency = "NGN") {

  return buildCard({
    title: "💰 AfriWork Wallet",
    description: "Your earnings overview",
    cta: "👉 💰 View Wallet Dashboard",
    reward: balance
  });
}

module.exports = {
  workCard,
  boostCard,
  walletCard
};
