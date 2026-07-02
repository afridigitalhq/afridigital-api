const { buildLayout } = require("../layout/layout.engine");
const bus = require('../eventbus');

async function layoutBrain(user, feed) {

  const layout = buildLayout(user, feed);

  bus.emit("AI_LAYOUT_COMPOSED", {
    userId: user.id,
    layout
  });

  return layout;
}

module.exports = { layoutBrain };
