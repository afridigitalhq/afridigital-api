const { assertApiVersion } = require("../runtime/safety/api.guard");
function selectAd(user, context) {

  const ads = [
    {
      type: 'affiliate',
      message: '🔥 Try Forex Signals Platform',
      url: 'https://example-affiliate.com'
    },
    {
      type: 'google',
      message: '📢 Sponsored: Boost your business online',
      url: 'https://ads.google.com'
    },
    {
      type: 'afri',
      message: '🚀 Boost your product with AfriAds',
      url: 'https://afridigital-hub.onrender.com'
    }
  ];

  return ads[
    Math.floor(Math.random() * ads.length)
  ];
}

module.exports = {
  selectAd
};
