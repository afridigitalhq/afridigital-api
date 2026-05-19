const { ingest } = require('./ingestion');
const { route } = require('./router');
const { execute } = require('./agent');
const { createEvent } = require('../event/types');
const { publish } = require('../event/bus');

function V8(msg) {

  const eventIn = createEvent('INGEST', ingest(msg));
  publish(eventIn);

  const decision = route(eventIn.payload.text);
  const eventRoute = createEvent('ROUTE', decision);
  publish(eventRoute);

  const result = execute(decision.lane, eventIn.payload.text);
  const eventOut = createEvent('EXECUTE', result);
  publish(eventOut);

  return result;
}

module.exports = { V8 };
