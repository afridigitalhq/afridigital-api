const crypto = require("crypto");

let INSTANCE_HASH = null;

function hashKernel(kernel) {
  return crypto.createHash("sha256")
    .update(JSON.stringify(Object.keys(kernel || {})))
    .digest("hex");
}

function lockKernelInstance(kernel) {
  const hash = hashKernel(kernel);

  if (!INSTANCE_HASH) {
    INSTANCE_HASH = hash;
    return true;
  }

  if (INSTANCE_HASH !== hash) {
    throw new Error("🚨 Kernel re-init detected (checksum mismatch)");
  }

  return true;
}

module.exports = { lockKernelInstance };
