const bus = require("../events/event.spine.cjs");

function injectAd(userId) {
  const ad = {
    id: "ad_" + Date.now(),
    type: "contextual",
    message: "Sponsored: Promote your business on AfriDigital"
  };

  bus.emit("AD_SUGGESTION_SHOWN", { userId, ad });
  return ad;
}

module.exports = { injectAd };
