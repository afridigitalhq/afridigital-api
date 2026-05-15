const { ingest } = require('./ingestion');
const { route } = require('./router');
const { execute } = require('./agent');
const { trace } = require('./trace');

function V8(msg) {

  const event = ingest(msg);
  trace({ stage: 'INGEST', event });

  const decision = route(event.text);
  trace({ stage: 'ROUTE', decision });

  const result = execute(decision.lane, event.text);
  trace({ stage: 'EXECUTE', result });

  return result;
}

module.exports = { V8 };
