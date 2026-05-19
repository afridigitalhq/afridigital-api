const stream = require('../stream/bus');
const logs = [];

function trace(event) {
  logs.push(event);
  console.log('[V8 TRACE]', JSON.stringify(event));
stream.publish({ type: 'trace', event });
}

module.exports = { trace };
