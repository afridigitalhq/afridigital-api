const { ingest } = require('./v8/ingestion');
const { route } = require('./v8/router');
const { execute } = require('./v8/agent');
const { trace } = require('./v8/trace');

function handle(msg) {
  const event = ingest(msg);

  trace(event);

  const decision = route(event.text);
  const result = execute(decision.lane, event.text);

  trace({
    stage: 'RESPONSE',
    lane: decision.lane,
    result
  });

  return result;
}

module.exports = { handle };
