const revenue = require("./brain.v6.revenue");
const messenger = require("../messenger/whatsapp.client");

async function handleMessage(msg) {

  const score = revenue.scoreUser(msg);

  if (score > 0.7) {
    await messenger.send(
      msg.from,
      "💰 We noticed you're interested — here’s a special offer for you."
    );

    await revenue.logConversion(msg.from, score);
  }
}

module.exports = { handleMessage };
