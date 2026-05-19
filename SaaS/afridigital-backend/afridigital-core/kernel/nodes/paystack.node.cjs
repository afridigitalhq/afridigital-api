const spine = require("../spine/redis.spine.cjs");

console.log("💳 PAYSTACK NODE ONLINE");

spine.on("PAYMENT_SUCCESS", (data) => {
  spine.emit("MEMBERSHIP_GRANTED", {
    user: data.user,
    plan: data.plan
  });
});
