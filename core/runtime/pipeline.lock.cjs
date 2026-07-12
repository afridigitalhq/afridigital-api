const fs = require('fs');
const path = require('path');

/**
 * PIPELINE LOCK FILE
 * ZERO-DRIFT ENFORCEMENT LAYER
 */

const ALLOWED_ROOT = path.resolve(__dirname, '../../dist');

function assertPipeline(file) {
  if (!file || typeof file !== 'string') {
    throw new Error('PIPELINE LOCK: invalid module path');
  }

  const resolved = path.resolve(file);

  if (!resolved.startsWith(ALLOWED_ROOT)) {
    throw new Error(
      'PIPELINE LOCK VIOLATION: only dist/ is allowed at runtime → ' + resolved
    );
  }

  if (!fs.existsSync(resolved)) {
    throw new Error('PIPELINE LOCK VIOLATION: module does not exist → ' + resolved);
  }

  return true;
}

function safeRequire(file) {
  assertPipeline(file);
  return require(path.resolve(file));
}

module.exports = {
  assertPipeline,
  safeRequire,
  ALLOWED_ROOT
};
