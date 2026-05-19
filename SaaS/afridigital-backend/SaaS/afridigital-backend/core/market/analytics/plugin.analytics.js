const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function getPluginStats() {

  const plugins =
    db.read('plugin.store.json');

  let revenue = 0;

  plugins.forEach(p => {
    revenue += p.revenue || 0;
  });

  return {
    totalPlugins: plugins.length,
    totalRevenue: revenue
  };
}

module.exports = {
  getPluginStats
};
