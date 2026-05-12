const { assertApiVersion } = require("../runtime/safety/api.guard");
const User = require("../../database/models/User");

async function buildContext(phone, message, channel) {
  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone });
  }

  user.lastActive = new Date();
  user.usageCount += 1;
  await user.save();

  return {
    user,
    message,
    channel,
    timestamp: new Date()
  };
}

module.exports = buildContext;
