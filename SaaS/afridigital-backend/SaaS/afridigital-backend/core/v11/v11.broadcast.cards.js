const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 📢 BROADCAST CARD ENGINE
 */

function fridayCouponCard(code = "BOOSTFRI10", discount = 10) {

  return `
📢 FRIDAY BOOST SPECIAL

🎟️ Coupon: ${code}

💰 Get ${discount}% off all TikTok boosts

━━━━━━━━━━━━━━━━━━
👉 GET YOUR COUPON CODE
━━━━━━━━━━━━━━━━━━

⏳ Valid till midnight
`;
}

module.exports = {
  fridayCouponCard
};
