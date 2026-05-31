const bus = require('./bus');

function waitForDone(streamId) {
  return new Promise((resolve, reject) => {
    let buffer = [];

    const handler = (event) => {
      if (event.type === "token") {
        buffer.push(event.value);
      }

      if (event.type === "done") {
        resolve({
          text: buffer.join(""),
          events: bus.get(streamId),
          meta: event
        });
      }

      if (event.type === "error") {
        reject(event);
      }
    };

    // 🔥 CRITICAL FIX: attach BEFORE resolution window matters
    bus.subscribe(streamId, handler);
  });
}

module.exports = { waitForDone };
