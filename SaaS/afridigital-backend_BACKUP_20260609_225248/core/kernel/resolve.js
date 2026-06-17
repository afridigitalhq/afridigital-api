const path = require('path');

function resolve(p) {
  return path.join(process.cwd(), p);
}

module.exports = resolve;
