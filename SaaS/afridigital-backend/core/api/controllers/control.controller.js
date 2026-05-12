const { assertApiVersion } = require("../runtime/safety/api.guard");
const { toggleFeature, getFlags } = require('../services/control.service');

function updateControl(req, res) {

  const { key, value } = req.body;

  const updated =
    toggleFeature(key, value);

  res.json({
    success: true,
    flags: updated
  });
}

function getControl(req, res) {

  res.json({
    success: true,
    flags: getFlags()
  });
}

module.exports = {
  updateControl,
  getControl
};
