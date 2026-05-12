const { assertApiVersion } = require("../runtime/safety/api.guard");
const { registerUser } = require('./user.engine');

function handleRegister(phone) {
  const user = registerUser(phone);

  return `
✅ Registration Successful

📱 Account: ${user.phone}
💳 Wallet Balance: ₦${user.wallet}
🆓 Premium: Disabled

🚀 Welcome to AfriDigital Ecosystem
`;
}

module.exports = { handleRegister };
