const { assertApiVersion } = require("../runtime/safety/api.guard");
function detectIntent(message, isAdmin) {
  const text = message.toLowerCase();

  if (isAdmin && text.includes('system health')) {
    return 'ADMIN_SYSTEM_HEALTH';
  }

  if (isAdmin && text.includes('afrilock')) {
    return 'ADMIN_LOCK';
  }

  if (isAdmin && text.includes('afriopen')) {
    return 'ADMIN_OPEN';
  }

  if (text.includes('football')) {
    return 'USER_FOOTBALL';
  }

  if (text.includes('forex')) {
    return 'USER_FOREX';
  }

  return 'UNKNOWN';
}

module.exports = { detectIntent };
