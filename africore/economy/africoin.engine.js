const ledger = require("../ledger/afribank.ledger");

function earnRule(event, user) {
  if (event === "referral") return 10;
  if (event === "engagement") return 1;
  if (event === "campaign_click") return 2;
  return 0;
}

function spendRule(action) {
  if (action === "send_campaign") return 20;
  if (action === "premium_feature") return 50;
  return 0;
}

async function processEarn(user, event) {
  const amount = earnRule(event, user);
  if (amount > 0) {
    await ledger.credit(user, amount);
  }
  return amount;
}

async function processSpend(user, action) {
  const cost = spendRule(action);
  if (cost > 0) {
    await ledger.debit(user, cost);
  }
  return cost;
}

module.exports = { processEarn, processSpend };
