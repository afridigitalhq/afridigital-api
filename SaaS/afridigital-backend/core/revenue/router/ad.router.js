const { assertApiVersion } = require("../runtime/safety/api.guard");
function routeAd(user, context) {

  // VERY SIMPLE VERSION (AI logic comes later)
  const rand = Math.random();

  if (rand < 0.4) {
    return 'internal';
  }

  if (rand < 0.8) {
    return 'affiliate';
  }

  return 'external';
}

module.exports = { routeAd };
