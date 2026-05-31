const kernel = require('./kernel');

async function execute(event, payload) {
  const check = require('../guard/kernelGuard')(event);

  if (check.blocked) {
    return check;
  }

  return await kernel.run(payload);
}

module.exports = execute;
