class FraudEngine {
  score(event) {
    let score = 0;

    if (event.amount > 10000) score += 40;
    if (event.type === "ledger.debit" && event.amount > 5000) score += 20;

    const hour = new Date(event.ts).getHours();
    if (hour < 5) score += 15;

    return {
      risk: score,
      flagged: score > 60
    };
  }
}

module.exports = new FraudEngine();
