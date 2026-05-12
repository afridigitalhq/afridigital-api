const { assertApiVersion } = require("../runtime/safety/api.guard");
const { getSystemMetrics } = require('../services/metrics.service');

function dashboard(req, res) {

  const metrics = getSystemMetrics();

  res.json({
    success: true,
    data: metrics
  });
}

module.exports = { dashboard };
