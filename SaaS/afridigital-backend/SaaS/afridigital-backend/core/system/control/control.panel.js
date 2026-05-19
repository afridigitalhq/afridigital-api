const { assertApiVersion } = require("../runtime/safety/api.guard");
let systemFlags = {
  ads: true,
  premium: true,
  forex: true,
  football: true
};

function toggleFeature(feature, value) {
  systemFlags[feature] = value;
  return systemFlags;
}

function getFlags() {
  return systemFlags;
}

module.exports = {
  toggleFeature,
  getFlags
};
