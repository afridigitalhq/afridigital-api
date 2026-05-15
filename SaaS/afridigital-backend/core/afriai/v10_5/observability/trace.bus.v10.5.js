const EventEmitter = require('events');
class TraceBusV10_5 {

  constructor() {
    this.stream = new EventEmitter();
    this.traces = [];
    this.sessionId = 'GLOBAL';
  }

  startSession(id) {
    this.sessionId = id || ('SESSION_' + Date.now());
    return this.sessionId;
  }

  emit(event) {

    const ts = Date.now();

    const trace = {
      id: 'TRACE_' + ts,
      sessionId: this.sessionId,
      ts,
      event: {
        ...event,
        start: ts,
        end: ts,
        duration: 0,
        health: 'OK'
      }
    };

    this.traces.push(trace);
    this.stream.emit('trace', trace);

    console.log('[TRACE]', JSON.stringify(trace));

    return trace;
  }

  dump() {
    return this.traces;
  }

  clear() {
    this.traces = [];
  }
}

module.exports = new TraceBusV10_5();


// STREAM CORE ACTIVE FLAG
const STREAM_CORE_ACTIVE = true;
