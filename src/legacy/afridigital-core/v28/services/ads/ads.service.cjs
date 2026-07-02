const { subscribe, publish } = require("../../events/event.bus.cjs");

subscribe("CHAT_MESSAGE", (data) => {
  const ad = {
    id: "ad_" + Date.now(),
    message: "Promote your service inside AfriDigital",
    userId: data.userId
  };

  publish("AD_INJECTED", ad);
});
