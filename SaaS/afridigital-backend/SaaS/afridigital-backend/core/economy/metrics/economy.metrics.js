const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function getEconomyMetrics() {

  const plugins =
    db.read('plugin.store.json');

  const ads =
    db.read('ads.db.json');

  return {
    plugins: plugins.length,
    ads: ads.length,
    revenue: plugins.reduce((a,b) => a + (b.revenue || 0), 0)
  };
}

module.exports = {
  getEconomyMetrics
};
