const logs = [];

function trace(event) {
  logs.push(event);
  console.log('[V8 TRACE]', JSON.stringify(event));
}

module.exports = { trace };
