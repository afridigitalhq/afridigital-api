const { assertApiVersion } = require("../runtime/safety/api.guard");
function renderAdCard(ad) {

return `
📢 Sponsored Opportunity

━━━━━━━━━━━━━━━
${ad.title}

👉 Click:
${ad.link}

━━━━━━━━━━━━━━━
⚡ Powered by AfriAI Ads Engine
`;
}

module.exports = { renderAdCard };
