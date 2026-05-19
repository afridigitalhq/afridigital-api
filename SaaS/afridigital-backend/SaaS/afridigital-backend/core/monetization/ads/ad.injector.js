const { assertApiVersion } = require("../runtime/safety/api.guard");
const { selectAd } =
require('../engine/ad.selector');

function injectAd(user, context) {

  const ad =
    selectAd(user, context);

  return `
━━━━━━━━━━━━━━━
📢 Sponsored Ad

${ad.message}

🔗 ${ad.url}
━━━━━━━━━━━━━━━
`;
}

module.exports = {
  injectAd
};
