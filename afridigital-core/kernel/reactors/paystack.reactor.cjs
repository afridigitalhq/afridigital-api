const bus = require("../../afridigital-core/kernel/event-bus/bus.cjs");

bus.onEvent("paystack.payment_success", (data) => {
  console.log("💰 PAYSTACK:", data);
});
