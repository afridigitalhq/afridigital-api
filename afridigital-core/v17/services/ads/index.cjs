const bus = require("../../spi../../afridigital-core/kernel/event-bus");
const EVENTS = require("../../contracts/events");

bus.on(EVENTS.AD_POSTED, (ad) => {
  console.log("📢 AD LIVE:", ad.url);
});
