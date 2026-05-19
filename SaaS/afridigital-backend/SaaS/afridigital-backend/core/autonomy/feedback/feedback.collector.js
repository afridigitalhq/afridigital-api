const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function collectFeedback(type, data) {

  const feedback =
    db.read('feedback.db.json');

  feedback.push({
    type,
    data,
    timestamp: Date.now()
  });

  db.write('feedback.db.json', feedback);
}

function getFeedback(type) {

  const feedback =
    db.read('feedback.db.json');

  return feedback.filter(
    f => f.type === type
  );
}

module.exports = {
  collectFeedback,
  getFeedback
};
