const bus = require('../eventbus');

function buildLayout(user, feed) {

  const sidebarBase = ["home", "wallet", "jobs", "earn", "services", "boost", "social", "profile"];

  // reorder sidebar based on user behavior
  const sidebar = [...sidebarBase].sort((a, b) => {
    const aScore = user.history?.includes(a) ? 1 : 0;
    const bScore = user.history?.includes(b) ? 1 : 0;
    return bScore - aScore;
  });

  // generate grid layout from feed
  const grid = feed.map(item => ({
    widget: item.type,
    span: item.priority > 0.7 ? 6 : 4,
    priority: item.priority
  }));

  const layout = {
    sidebar,
    grid
  };

  bus.emit("LAYOUT_UPDATED", {
    userId: user.id,
    layout
  });

  return layout;
}

module.exports = { buildLayout };
