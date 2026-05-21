const bus = require("../../afridigital-core/kern../../afridigital-core/kernel/events/bus.cjs");

bus.onEvent("paystack.payment_success", (data) => {
  console.log("💰 PAYSTACK:", data);
});
