const bus = require('./bus');
const dispatcher = require('../runtime/dispatcher');

(async () => {

  console.log("⚡ Event Bus Worker Running...");

  await bus.connect();

  await bus.consume("afri-events", async (event) => {
    console.log("📩 Event received:", event.type);

    if(event.type === "dispatch"){
      await dispatcher.dispatch(event.payload);
    }
  });

})();
