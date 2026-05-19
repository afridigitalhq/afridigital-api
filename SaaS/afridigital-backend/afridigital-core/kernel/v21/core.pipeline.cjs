const { renderAd } = require("../render/render.engine.cjs");
const { trackAdEvent } = require("../tracking/ad.track.cjs");

function processResponse(input) {

  const response = {
    message: "Here is your AI response",
    timestamp: Date.now()
  };

  // inject inline ad card
  const ad = {
    id: "ad_" + Date.now(),
    title: "Build your website today",
    shortText: "Get your business online in minutes",
    fullText: "We design, deploy and host your website instantly on AfriDigital.",
    image: "https://cdn.afridigital/ad.jpg",
    actions: ["Order Now", "Talk to Admin"]
  };

  const renderedAd = renderAd(ad);

  trackAdEvent({
    type: "IMPRESSION",
    adId: ad.id
  });

  return {
    ...response,
    ad: renderedAd
  };
}

module.exports = { processResponse };
