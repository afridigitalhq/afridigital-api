const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🌐 AfriOS External Ads Engine v2.8
 * (AdSense / Affiliate / Tracking Layer)
 */

function injectExternalAd(ad) {

  if (ad.type !== "BOOST") {
    return null;
  }

  return {
    enabled: true,
    provider: "EXTERNAL",
    slot: "AFRI_CHAT_CARD",
    renderType: "NATIVE_CARD_WRAPPED",
    tracking: {
      impressions: true,
      clicks: true
    },

    note: "External ads (AdSense / affiliate) allowed only on BOOST cards"
  };
}

module.exports = {
  injectExternalAd
};
