/**
 * Ensures singleton event bus identity across runtime
 */

const EventEmitter = require('events');

let BUS_FINGERPRINT = global.__AFRI_BUS_FINGERPRINT__;

if (!global.__AFRI_BUS__) {
  global.__AFRI_BUS__ = new EventEmitter();
  BUS_FINGERPRINT = Math.random().toString(36).slice(2);

  global.__AFRI_BUS_FINGERPRINT__ = BUS_FINGERPRINT;
}

module.exports = {
  bus: global.__AFRI_BUS__,
  fingerprint: BUS_FINGERPRINT
};
