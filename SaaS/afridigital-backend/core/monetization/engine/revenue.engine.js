const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function calculateRevenue(user) {

  const ads =
    db.read('ads.db.json');

  const userAds =
    ads.filter(
      a => a.user === user
    );

  const earnings =
    userAds.reduce((sum, ad) => {

      if (ad.event === 'view') return sum + 1;
      if (ad.event === 'click') return sum + 5;

      return sum;

    }, 0);

  return {
    user,
    earnings
  };
}

module.exports = {
  calculateRevenue
};
