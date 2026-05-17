const path = require('path');

const BASE = path.resolve(__dirname, '../..');

module.exports = {
  telegram: require(path.join(BASE, 'services/telegram-bot/bot.engine.cjs')),
  whatsapp: require(path.join(BASE, 'services/whatsapp.unified')),
  wallet: require(path.join(BASE, 'services/wallet/wallet.ledger.cjs')),
  security: require(path.join(BASE, 'services/security/fraud.throttle.cjs')),
};
