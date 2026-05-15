const traceBus = require('../afriai/v10_5/observability/trace.bus.v10.5');

function routeMessage(msg) {

  const trace = traceBus.emit({
    stage: 'WHATSAPP_IN',
    from: msg.from,
    text: msg.text,
    ts: Date.now()
  });

  let lane = 'BALANCED';

  if (msg.text.includes('pay') || msg.text.includes('money')) {
    lane = 'FINANCE';
  } else if (msg.text.length < 20) {
    lane = 'FAST';
  }

  const routed = {
    sessionId: trace.sessionId,
    lane,
    input: msg.text,
    traceId: trace.id
  };

  traceBus.emit({
    stage: 'ROUTER_DECISION',
    lane,
    parent: trace.id
  });

  return routed;
}

module.exports = { routeMessage };
