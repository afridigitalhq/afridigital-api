const bus = require("../../spi../../afridigital-core/kern../../afridigital-core/kernel/events");
const EVENTS = require("../../contracts/events");

bus.on(EVENTS.AD_POSTED, (ad) => {
  console.log("📢 AD LIVE:", ad.url);
});
