const bus = require("./event.bus");
const messenger = require("../messenger/whatsapp.client");

bus.on("whatsapp:send", async (payload) => {
  await messenger.send(payload.to, payload.message);
});
