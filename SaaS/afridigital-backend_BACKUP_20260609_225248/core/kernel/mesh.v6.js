
const stream = require('./stream.v6');

async function publish(type, data) {
  return await stream.emit({ type, data });
}

async function subscribe(handler) {
  setInterval(async () => {
    const events = await stream.read(10);

    for (const e of events) {
      try {
        await handler(e);
      } catch (err) {
        console.log('mesh handler error:', err.message);
      }
    }
  }, 3000);
}

module.exports = { publish, subscribe };

