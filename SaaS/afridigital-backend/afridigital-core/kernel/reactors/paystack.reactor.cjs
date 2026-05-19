const bus = require("../event-bus/bus.cjs");

bus.onEvent("paystack.payment_success", (data) => {
  console.log("💰 PAYSTACK:", data);
});
