const { assertApiVersion } = require("../runtime/safety/api.guard");
const { getMetrics } = require('./metrics/system.metrics');
const { renderDashboard } = require('./render/dashboard.renderer');

function getDashboard() {

  const metrics = getMetrics();

  return renderDashboard(metrics);
}

module.exports = { getDashboard };
