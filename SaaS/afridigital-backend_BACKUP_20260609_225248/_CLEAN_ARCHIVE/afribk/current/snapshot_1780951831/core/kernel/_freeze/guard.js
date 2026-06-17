const fs = require('fs');
const path = require('path');

const KERNEL_PATH = path.join(process.cwd(), 'core/kernel');

function assertFrozen(targetPath) {
  if (!targetPath) return true;

  const normalized = path.normalize(targetPath);

  if (normalized.includes(KERNEL_PATH) && (
      normalized.includes('index.js') ||
      normalized.includes('pluginRegistry') ||
      normalized.includes('runtime')
  )) {
    throw new Error('🧊 KERNEL FROZEN: mutation blocked');
  }

  return true;
}

function wrapFs() {
  const original = fs.writeFileSync;

  fs.writeFileSync = function (file, data, options) {
    assertFrozen(file);
    return original(file, data, options);
  };
}

module.exports = {
  assertFrozen,
  wrapFs
};
