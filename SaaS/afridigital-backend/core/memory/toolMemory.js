const history = {};

function remember(userId, entry) {
  if (!history[userId]) {
    history[userId] = [];
  }

  history[userId].push({
    ...entry,
    timestamp: Date.now()
  });

  // keep memory bounded
  if (history[userId].length > 20) {
    history[userId].shift();
  }
}

function getHistory(userId) {
  return history[userId] || [];
}

module.exports = {
  remember,
  getHistory
};
