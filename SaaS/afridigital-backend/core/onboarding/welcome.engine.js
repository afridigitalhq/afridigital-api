const { assertApiVersion } = require("../runtime/safety/api.guard");
const platforms = require('../../config/platforms');

function getWelcomeMessage() {
return `
🚀 Welcome to AfriDigital Innovation Hub

You can now:

📢 Boost your business directly from WhatsApp
💼 Find digital jobs & work-from-home opportunities
🤖 Use AI tools for business growth
📈 Access forex & football insights
🎟 Participate in free daily ad boost raffles
💳 Earn and withdraw to your local bank account

━━━━━━━━━━━━━━━

Choose an option:

1️⃣ Boost My Business
2️⃣ Find Jobs / Earn Online
3️⃣ AI Assistant
4️⃣ Football Services
5️⃣ Forex Insights
6️⃣ Open AfriWeb 🌍

Type REGISTER to unlock your AfriDigital account.

━━━━━━━━━━━━━━━
🌍 AfriWeb:
${platforms.web}
`;
}

module.exports = { getWelcomeMessage };
