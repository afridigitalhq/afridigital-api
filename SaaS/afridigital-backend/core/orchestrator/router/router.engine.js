const { assertApiVersion } = require("../runtime/safety/api.guard");
const { detectIntent } =
require('../intents/intent.engine');

const workflow =
require('../../workflows/workflow.router');

const media =
require('../../media/engine/media.router');

const { injectAd } =
require('../../monetization/ads/ad.injector');

const admin =
require('../../execution/admin/admin.commands');

const user =
require('../../execution/user/user.commands');

async function orchestrate(payload) {

  const intent =
    detectIntent(payload.message);

  switch(intent) {

    case 'BOOST_WORKFLOW':
      return workflow.handleWorkflow(
        payload.sender,
        payload.message
      );

    case 'MEDIA':
      return media.handleMedia(
        payload.sender,
        payload.message,
        payload.raw
      );

    case 'ADMIN_CONTROL':
      return admin.executeAdminCommand(
        payload.message
      );

    case 'WALLET':
      return user.executeUserCommand(
        'wallet',
        payload.sender
      );

    case 'ADS':
      return injectAd(
        payload.sender,
        payload.message
      );

    default:
      return `
🤖 AfriAI V5 Active

Ask:
- boost
- wallet
- system
- ads
`;
  }
}

module.exports = {
  orchestrate
};
