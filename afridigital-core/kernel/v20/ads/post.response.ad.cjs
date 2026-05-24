const { selectAd } = require("./ad.engine.cjs");
const { trackEvent } = require("../tracking/track.engine.cjs");

function attachAd(response, context) {

  const ad = selectAd(context);

  trackEvent({
    type: "AD_IMPRESSION",
    adId: ad.id
  });

  return {
    ...response,
    ad: {
      message: "Would you like to see this?",
      content: ad.content,
      id: ad.id
    }
  };
}

module.exports = { attachAd };
