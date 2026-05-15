const express = require('express');

const { ingest } = require('./core/ingestion/whatsapp.ingest');
const { route } = require('./core/router/lane.router');
const { execute } = require('./core/engine/reply.engine');
const { trace } = require('./core/observability/trace.bus');
const { attach } = require('./core/stream/socket.bridge');

const app = express();
app.use(express.json());

// webhook
app.post('/webhook', (req, res) => {

  const event = ingest(req.body);
  const lane = route(event.text);
  const response = execute(lane, event.text);

  trace({ event, lane, response });

  return res.json({
    ok: true,
    lane,
    response
  });
});

// start server
const server = app.listen(process.env.PORT || 4000, () => {
  console.log('🚀 V8 Gateway Stable');
});

attach(server);
