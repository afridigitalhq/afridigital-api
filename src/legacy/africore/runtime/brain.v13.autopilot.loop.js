const revenue = require("./brain.v13.revenue.autopilot");
const messenger = require("../messenger/whatsapp.client");

async function run(msg, intentScore) {

  await revenue.scoreUser(msg.from, intentScore);

  if (intentScore > 0.85) {
    await messenger.send(
      msg.from,
      "💰 Premium offer unlocked for you — reply YES to activate."
    );
  }
}

module.exports = { run };
