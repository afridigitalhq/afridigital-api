function assertLedgerOnly(source, context = "") {
  const forbiddenSources = [
    "wallet.engine",
    "ad.wallet",
    "earnings.engine",
    "autopay.engine"
  ];

  for (const f of forbiddenSources) {
    if ((source || "").includes(f)) {
      throw new Error(`🚨 FINANCE POLICY VIOLATION in ${context}: ${f} is not allowed direct write`);
    }
  }

  return true;
}

module.exports = { assertLedgerOnly };
