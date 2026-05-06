const { updateMood, applyMoodContext } = require("../emotion/moodEngine");

function processEmotion({ userId, message }) {
  updateMood(userId, message);
}

function injectEmotion({ userId, message }) {
  return applyMoodContext(userId, message);
}

module.exports = { processEmotion, injectEmotion };
