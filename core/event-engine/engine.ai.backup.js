const eventLog = [];

function emit(type, service, status, msg) {
  const event = {
    id: Date.now() + Math.random(),
    ts: new Date().toISOString(),
    type,
    service,
    status,
    msg
  };

  eventLog.push(event);

  // prevent memory explosion (ring buffer)
  if (eventLog.length > 500) eventLog.shift();

  return event;
}

function getEvents(limit = 100) {
  return eventLog.slice(-limit);
}

function replay(fromIndex = 0, toIndex = eventLog.length) {
  return eventLog.slice(fromIndex, toIndex);
}

module.exports = { emit, getEvents, replay };
