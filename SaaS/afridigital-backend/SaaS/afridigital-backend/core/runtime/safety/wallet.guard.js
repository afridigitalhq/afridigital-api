function assertWalletMutation(action, context = "") {
  const forbidden = [
    "balance +=",
    "balance -=",
    "wallet.balance",
    "user.wallet",
    "db.write('wallet"
  ];

  const text = (action || "") + " " + context;

  for (const rule of forbidden) {
    if (text.includes(rule)) {
      throw new Error(`🚨 WALLET MUTATION BLOCKED in ${context}: ${rule}`);
    }
  }

  return true;
}

module.exports = { assertWalletMutation };
