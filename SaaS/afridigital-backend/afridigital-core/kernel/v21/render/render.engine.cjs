const { createAdCard } = require("../cards/card.schema.cjs");
const { attachMedia } = require("../media/media.engine.cjs");

function renderAd(ad) {

  let card = createAdCard(ad);
  card = attachMedia(card);

  return {
    type: "INLINE_AD_CARD",
    payload: card
  };
}

module.exports = { renderAd };
