const { assertApiVersion } = require("../runtime/safety/api.guard");
const wallet =
require('../../economy/wallet.engine');

function executeUserCommand(text, sender) {

  const cmd =
    text.toLowerCase();

  if (cmd === 'wallet') {

    const userWallet =
      wallet.getWallet(sender);

    return `
💳 WALLET INFO

Balance: ₦${userWallet.balance}
`;
  }

  if (cmd === 'raffle') {

    return `
🎟 DAILY BOOST RAFFLE

To participate:
Send:
- product image
- product description
- contact info

Winner gets free promotion 🚀
`;
  }

  return `
🤖 AfriAI Ready

Available:
- wallet
- raffle
`;
}

module.exports = {
  executeUserCommand
};
