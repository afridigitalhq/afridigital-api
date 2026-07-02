const { buildFeed } = require("../feed/feed.engine");
const bus = require('../eventbus');

async function feedBrain(user) {

  const feed = buildFeed(user);

  bus.emit("AI_FEED_GENERATED", {
    userId: user.id,
    feed
  });

  return feed;
}

module.exports = { feedBrain };
