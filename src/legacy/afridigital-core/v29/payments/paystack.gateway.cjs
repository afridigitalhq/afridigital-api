console.log("\n💳 PAYSTACK GATEWAY ACTIVE\n");

async function initializeDeposit(userId, amount) {
  return {
    userId,
    amount,
    reference: "pay_" + Date.now(),
    status: "initialized"
  };
}

async function withdrawal(userId, amount) {
  return {
    userId,
    amount,
    status: "processing"
  };
}

module.exports = {
  initializeDeposit,
  withdrawal
};
