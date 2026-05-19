const { assertApiVersion } = require("../runtime/safety/api.guard");
function fallbackResponse() {
  return `
🤖 AfriAI could not understand your request.

Try:
1️⃣ Boost Business
2️⃣ Jobs
3️⃣ Football
4️⃣ Forex
5️⃣ Wallet
`;
}

module.exports = { fallbackResponse };
