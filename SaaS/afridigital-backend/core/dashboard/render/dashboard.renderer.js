const { assertApiVersion } = require("../runtime/safety/api.guard");
function renderDashboard(metrics) {

return `
📊 AFRIDIGITAL CONTROL DASHBOARD

━━━━━━━━━━━━━━━
👤 Users: ${metrics.users}
💬 Messages: ${metrics.messages}
📢 Ads: ${metrics.ads}
💳 Wallets: ${metrics.totalWallets}

━━━━━━━━━━━━━━━
🧠 System Status: ACTIVE
🌍 Ecosystem: ONLINE
`;
}

module.exports = { renderDashboard };
