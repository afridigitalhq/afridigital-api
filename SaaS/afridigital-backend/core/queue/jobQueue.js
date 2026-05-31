const handlers = {};

function onJob(event, fn) {
  handlers[event] = fn;
}

async function emit(event, payload) {
  if (handlers[event]) {
    return handlers[event](payload);
  }
}

module.exports = { onJob, emit };
