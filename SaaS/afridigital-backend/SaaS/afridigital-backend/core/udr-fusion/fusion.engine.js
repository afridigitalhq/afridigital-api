const trace = require('../runtime/trace/afritrace.core');
const udr = require('../udr/udr.engine');
const bus = require('../udr/udr.bus');

console.log('🔥 UDR–AFRITRACE FUSION LAYER ACTIVE');

const TRACE_MAP = {
  whatsapp: 'whatsappOS',
  ai: 'aiCore',
  finance: 'finance',
  system: 'kernel',
  risk: 'risk',
  queue: 'queue'
};

function normalizeTrace(traceEvent) {
  const type = traceEvent.type || 'unknown';

  let module = 'stream';

  for (const key in TRACE_MAP) {
    if (type.includes(key)) {
      module = TRACE_MAP[key];
      break;
    }
  }

  return {
    module,
    type,
    payload: traceEvent.payload,
    ts: traceEvent.ts
  };
}

function ingest(traceEvent) {
  const normalized = normalizeTrace(traceEvent);

  udr.emit(
    normalized.module,
    'trace',
    normalized.payload
  );

  bus.emitEvent('fusion.event', normalized);

  return normalized;
}

function attach() {
  const original = trace.logTrace;

  trace.logTrace = function(type, payload) {
    const event = original(type, payload);

    try {
      ingest(event);
    } catch (e) {
      console.log('❌ FUSION ERROR:', e.message);
    }

    return event;
  };

  console.log('🔗 AfriTrace ↔ UDR fusion stable link active');
}

attach();

module.exports = { ingest, attach };
