const bus = require('../eventbus');

function scoreWidget(user, widget) {

  let score = 0;

  const history = user.history || [];

  if (widget.type === "wallet" && history.includes("wallet")) score += 0.9;
  if (widget.type === "jobs" && history.includes("jobs")) score += 0.8;
  if (widget.type === "earn" && history.includes("earn")) score += 0.7;
  if (widget.type === "services" && history.includes("services")) score += 0.6;
  if (widget.type === "boost" && history.includes("boost")) score += 0.5;

  // default relevance boost
  score += Math.random() * 0.2;

  return Math.min(score, 1);
}

function buildFeed(user) {

  const widgets = [
    { type: "wallet" },
    { type: "jobs" },
    { type: "earn" },
    { type: "services" },
    { type: "boost" },
    { type: "notifications" },
    { type: "activity" }
  ];

  const ranked = widgets
    .map(w => ({
      ...w,
      priority: scoreWidget(user, w)
    }))
    .sort((a, b) => b.priority - a.priority);

  bus.emit("FEED_UPDATED", {
    userId: user.id,
    feed: ranked
  });

  return ranked;
}

module.exports = { buildFeed };

// optional hook
const { buildLayout } = require("../layout/layout.engine");

// after feed generation
// layout = buildLayout(user, feed);

