const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriCoin Conversion Engine v1.0
 * Internal economy conversion system
 */

// 🌍 COUNTRY RATES
const rates = {
  NGN: {
    native: 100,
    africoin: 1000
  },

  USD: {
    native: 1,
    africoin: 1000
  },

  GHS: {
    native: 100,
    africoin: 1000
  },

  KES: {
    native: 100,
    africoin: 1000
  }
};

// 🔄 NATIVE → AFRICOIN
function convertToAfriCoin(amount, currency = "NGN") {

  const rule = rates[currency] || rates.NGN;

  return Math.floor(
    (amount / rule.native) * rule.africoin
  );
}

// 🔄 AFRICOIN → NATIVE
function convertToNative(africoin, currency = "NGN") {

  const rule = rates[currency] || rates.NGN;

  return Math.floor(
    (africoin / rule.africoin) * rule.native
  );
}

module.exports = {
  convertToAfriCoin,
  convertToNative
};
