const path = require('path');

function execute(file) {
  const resolved = path.resolve(process.cwd(), file);

  if (!resolved.includes('/dist/')) {
    throw new Error('PIPELINE VIOLATION: only dist allowed');
  }

  return require(resolved);
}

module.exports = { execute };
