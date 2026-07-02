const bus = require("../../eventbus");

const activityLog = [];

/**
 * 🧠 Track all system actions
 */
bus.on("*", (event) => {
  activityLog.push({
    ...event,
    timestamp: Date.now()
  });
});

function getActivity() {
  return activityLog;
}

module.exports = { getActivity };
