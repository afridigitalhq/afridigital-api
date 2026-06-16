const os = require("os");
const crypto = require("crypto");

function getNodeId() {
  return crypto
    .createHash("sha1")
    .update(os.hostname() + os.platform() + os.cpus().length)
    .digest("hex");
}

function getNodeInfo() {
  return {
    id: getNodeId(),
    hostname: os.hostname(),
    cpus: os.cpus().length,
    memory: os.totalmem(),
    uptime: os.uptime(),
    platform: os.platform()
  };
}

module.exports = {
  getNodeId,
  getNodeInfo
};
