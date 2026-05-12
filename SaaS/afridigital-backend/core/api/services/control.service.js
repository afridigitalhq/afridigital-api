const { assertApiVersion } = require("../runtime/safety/api.guard");
let flags = {
  ads: true,
  forex: true,
  football: true,
  premium: true
};

function toggleFeature(key, value) {
  flags[key] = value;
  return flags;
}

function getFlags() {
  return flags;
}

module.exports = {
  toggleFeature,
  getFlags
};
