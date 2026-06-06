const bus = require("../../eventbus");

const notifications = {};

/**
 * 🧠 Real-time notification system
 */
bus.on("EARN", (data) => {

  if (!notifications[data.userId]) {
    notifications[data.userId] = [];
  }

  notifications[data.userId].push({
    type: "EARN",
    message: `You earned ${data.amount}`,
    time: Date.now()
  });
});

bus.on("BOOST", (data) => {

  if (!notifications[data.userId]) {
    notifications[data.userId] = [];
  }

  notifications[data.userId].push({
    type: "BOOST",
    message: `Boost activated`,
    time: Date.now()
  });
});

function getNotifications(userId) {
  return notifications[userId] || [];
}

module.exports = { getNotifications };
