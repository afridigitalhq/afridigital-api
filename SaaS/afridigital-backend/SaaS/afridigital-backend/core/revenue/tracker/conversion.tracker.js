const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function trackConversion(data) {

  const conversions =
    db.read('conversions.db.json');

  conversions.push({
    ...data,
    timestamp: Date.now()
  });

  db.write('conversions.db.json', conversions);
}

module.exports = { trackConversion };
