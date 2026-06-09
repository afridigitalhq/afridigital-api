const bus = require("./bus");
const eventLog = require("./eventLog");
const replayEngine = require("./replayEngine");

/**
 * Kernel: bridges event bus + persistent log
 */

function emit(type, payload = {}, traceId = null) {
  const event = {
    id: 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2),
    ts: Date.now(),
    type,
    payload,
    traceId,
    node: 'local'
  };

  if (eventLog?.append) {
    eventLog.append(event);
  }

  bus.publish(type, event);

  return event;
}


function on(type, handler) {
  bus.subscribe(type, handler);
}

function replay(query) {
  return replayEngine.replay(query);
}

function memory() {
  return replayEngine.rebuildMemory();
}

module.exports = {
  emit,
  on,
  replay,
  memory
};
