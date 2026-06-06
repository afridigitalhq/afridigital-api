const { matchUser } = require("../marketplace/matcher.engine");
const bus = require('../eventbus');

async function marketplaceBrain(userProfile, dataset) {

  const result = matchUser(
    userProfile,
    dataset.jobs || [],
    dataset.earn || [],
    dataset.services || []
  );

  bus.emit("AI_MARKETPLACE_RESULT", {
    userId: userProfile.id,
    result
  });

  return result;
}

module.exports = { marketplaceBrain };
