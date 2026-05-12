const { assertApiVersion } = require("../runtime/safety/api.guard");
const { detectIntent } = require('../intent/intent.engine');
const { canAccess } = require('../permissions/permissions.engine');
const { requireRegistration } = require('../middleware/registration.middleware');
const { injectFooter } = require('../responses/footer.engine');
const { fallbackResponse } = require('../handlers/fallback.handler');
const { getLiveHealth } = require('../system/system.health.live');
const { renderHealth } = require('../renderers/whatsapp.renderer');

async function orchestrateMessage({
  message,
  sender,
  isAdmin
}) {

  const text = message.toLowerCase();

  if (text === 'register') {

    const { handleRegister } = require('../users/register.flow');

    const result = handleRegister(sender);

    return injectFooter(result);
  }

  const registration = requireRegistration(sender);

  if (!registration.allowed) {
    return injectFooter(registration.message);
  }

  const intent = detectIntent(message, isAdmin);

  const allowed = canAccess(intent, isAdmin);

  if (!allowed) {
    return injectFooter(
      '⛔ Access Denied'
    );
  }

  switch(intent) {

    case 'ADMIN_SYSTEM_HEALTH':

      const health = await getLiveHealth();

      return injectFooter(
        renderHealth(health)
      );

    case 'USER_FOOTBALL':

      return injectFooter(
        '⚽ Football module loading'
      );

    case 'USER_FOREX':

      return injectFooter(
        '📈 Forex module loading'
      );

    default:

      return injectFooter(
        fallbackResponse()
      );
  }
}

module.exports = { orchestrateMessage };
