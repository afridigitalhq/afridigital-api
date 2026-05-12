const { assertApiVersion } = require("../runtime/safety/api.guard");
const { getSystemHealth } = require('../services/system.service');

function systemHealth(req, res) {

  res.json({
    success: true,
    data: getSystemHealth()
  });
}

module.exports = { systemHealth };
