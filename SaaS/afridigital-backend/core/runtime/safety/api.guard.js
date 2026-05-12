const { API_VERSION } = require("../../config/api.version.lock");

function assertApiVersion(url, context = "") {
  if (!url.includes(API_VERSION)) {
    throw new Error(`🚨 API VERSION VIOLATION in ${context}: expected ${API_VERSION}`);
  }
  return true;
}

module.exports = { assertApiVersion };
