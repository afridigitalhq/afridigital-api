const bus = require("../core/context.cjs");
const EVENTS = require("../../afridigital-core/kern../../afridigital-core/kernel/events/registry.cjs");

function onPayment(status, data) {
  if (status === "success") {
    bus.emit(EVENTS.PAYSTACK_PAYMENT_SUCCESS, data);
  } else {
    bus.emit(EVENTS.PAYSTACK_PAYMENT_FAILED, data);
  }
}

module.exports = { onPayment };
