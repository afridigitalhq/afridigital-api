const { assertApiVersion } = require("../runtime/safety/api.guard");
function getMainMenu() {
return `
📋 AfriAI Main Menu

1️⃣ Business Boost
2️⃣ AI Services
3️⃣ Jobs & Earnings
4️⃣ Football
5️⃣ Forex
6️⃣ Wallet
7️⃣ Premium Services
`;
}

module.exports = { getMainMenu };
