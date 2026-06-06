const { dispatch } = require("./bridge/action.dispatcher");
const wallet = require("../economy/wallet.engine");
const activity = require("../economy/activity.engine");
const notifications = require("../economy/notifications.engine");

async function economyBrain(input, userId = "demo-user") {

  const text = input.toLowerCase();

  let intent = "unknown";

  // =========================
  // INTENT CLASSIFICATION
  // =========================
  if (text.includes("job")) intent = "jobs";
  if (text.includes("earn")) intent = "earn";
  if (text.includes("service")) intent = "services";
  if (text.includes("boost")) intent = "boost";
  if (text.includes("wallet")) intent = "wallet";

  // =========================
  // AUTONOMOUS ACTION LOGIC
  // =========================

  if (text.includes("pay")) {
    wallet.debit(userId, 10);

    activity.log(userId, "AI_PAYMENT", { input });

    notifications.add(userId, {
      title: "AI Action",
      message: "Payment processed by AfriAI"
    });
  }

  if (text.includes("earn")) {
    wallet.credit(userId, 5);

    activity.log(userId, "AI_EARN", { input });

    notifications.add(userId, {
      title: "Earning Detected",
      message: "You earned from AI task execution"
    });
  }

  // =========================
  // DISPATCH TO SYSTEM BUS
  // =========================

  const result = await dispatch(intent, {
    source: "ai_brain",
    input,
    userId
  });

  return {
    intent,
    result
  };
}

module.exports = { economyBrain };
