const { assertApiVersion } = require("../runtime/safety/api.guard");
const { detectIntent } = require('../intent/intent.engine');
const { getSystemHealth } = require('../system/system.health');
const { renderHealth } = require('../renderers/whatsapp.renderer');

async function routeMessage(message, sender, isAdmin) {
  const intent = detectIntent(message, isAdmin);

  switch(intent) {

    case 'ADMIN_SYSTEM_HEALTH':
      const health = await getSystemHealth();
      return renderHealth(health);

    case 'ADMIN_LOCK':
      return '🔒 AfriDigital Control Command Center Locked';

    case 'ADMIN_OPEN':
      return '🔑 Send Admin Password';

    case 'USER_FOOTBALL':
      return '⚽ Football module coming online';

    case 'USER_FOREX':
      return '📈 Forex module coming online';

    default:
      return '🤖 AfriAI did not understand request';
  }
}

module.exports = { routeMessage };
