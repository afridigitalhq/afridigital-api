const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function blockUser(userId, reason) {

  const blocked =
    db.read('blocked.db.json');

  blocked.push({
    userId,
    reason,
    timestamp: Date.now()
  });

  db.write('blocked.db.json', blocked);

  console.log('🛡 USER BLOCKED:', userId);

  return true;
}

function isBlocked(userId) {

  const blocked =
    db.read('blocked.db.json');

  return blocked.some(
    b => b.userId === userId
  );
}

module.exports = {
  blockUser,
  isBlocked
};
