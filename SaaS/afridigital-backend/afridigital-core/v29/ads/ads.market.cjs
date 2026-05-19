const ads = [];

function createAd(ad) {
  ads.push(ad);
}

function getAd() {
  return ads[Math.floor(Math.random() * ads.length)] || null;
}

module.exports = {
  createAd,
  getAd
};
