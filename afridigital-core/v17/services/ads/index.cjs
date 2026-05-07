const bus = require("../../spine/event-bus");
const EVENTS = require("../../contracts/events");

bus.on(EVENTS.AD_POSTED, (ad) => {
  console.log("📢 AD LIVE:", ad.url);
});
