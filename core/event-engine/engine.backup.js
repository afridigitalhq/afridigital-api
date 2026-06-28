const eventBuffer = [];

function emit(type, service, status, msg) {
  const event = {
    type,
    service,
    status,
    msg,
    ts: Date.now()
  };

  eventBuffer.push(event);

  // prevent memory overflow
  if (eventBuffer.length > 500) eventBuffer.shift();

  return event;
}

function getEvents() {
  return eventBuffer;
}

module.exports = { emit, getEvents };
