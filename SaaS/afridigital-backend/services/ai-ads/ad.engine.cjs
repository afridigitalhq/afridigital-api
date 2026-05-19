const ads = [
  {
    title: "🔥 Promote Your Business",
    text: "Reach thousands through AfriDigital AI",
    image: "/ads/business.png"
  },
  {
    title: "💼 Daily Jobs Available",
    text: "Earn directly from WhatsApp & Web",
    image: "/ads/jobs.png"
  }
];

function getAd() {
  return ads[Math.floor(Math.random() * ads.length)];
}

module.exports = { getAd };
