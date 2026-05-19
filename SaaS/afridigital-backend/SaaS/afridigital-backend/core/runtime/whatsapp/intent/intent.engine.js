const { assertApiVersion } = require("../runtime/safety/api.guard");
function detectIntent(message, adminNumber, sender) {

  const text = message.toLowerCase();

  const isAdmin = sender === adminNumber;

  if (text.includes('system health') && isAdmin) {
    return 'SYSTEM_HEALTH';
  }

  if (text.includes('help')) {
    return 'HELP';
  }

  if (text.includes('plugin')) {
    return 'PLUGIN_QUERY';
  }

  return 'CHAT';
}

module.exports = {
  detectIntent
};
