const { getFlags, setFlag } = require("../state/featureFlags.store");

/**
 * GET current flags
 */
function getFlagsController(req, res) {
  res.json(getFlags());
}

/**
 * UPDATE a flag
 */
function updateFlagController(req, res) {
  const { key, value } = req.body;
  const result = setFlag(key, value);
  res.json(result);
}

module.exports = { getFlagsController, updateFlagController };
