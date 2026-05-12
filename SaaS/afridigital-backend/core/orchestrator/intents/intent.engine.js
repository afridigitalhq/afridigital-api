const { assertApiVersion } = require("../runtime/safety/api.guard");
function detectIntent(text) {

  const msg = text.toLowerCase();

  if (msg.includes('system')) return 'SYSTEM';
  if (msg.includes('dashboard')) return 'DASHBOARD';
  if (msg.includes('boost')) return 'BOOST_WORKFLOW';
  if (msg.includes('wallet')) return 'WALLET';
  if (msg.includes('ads')) return 'ADS';
  if (msg.includes('media')) return 'MEDIA';

  if (msg.includes('control')) return 'ADMIN_CONTROL';

  return 'GENERAL';
}

module.exports = {
  detectIntent
};
