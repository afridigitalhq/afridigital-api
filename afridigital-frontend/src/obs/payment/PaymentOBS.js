export function PaymentOBS(data) {
  return {
    module: "PAYMENT_OBSERVABILITY",
    totalTransactions: data.transactions?.length || 0,
    failedPayments: data.failed || 0,
    riskLevel:
      (data.failed / (data.transactions?.length || 1)) > 0.2
        ? "HIGH_RISK"
        : "NORMAL"
  };
}
