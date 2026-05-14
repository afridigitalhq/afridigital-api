class AnalyticsAggregateV10_1 {

  constructor() {

    this.metrics = {

      successfulTx: 0,
      failedTx: 0,
      fraudBlocked: 0,

      totalRevenue: 0,
      affiliatePaid: 0,

      cryptoVolume: 0,
      fiatVolume: 0
    };
  }

  ingest(event) {

    switch(event.type) {

      case "transfer.completed":
        this.metrics.successfulTx++;
        break;

      case "transaction.failed":
        this.metrics.failedTx++;
        break;

      case "fraud.blocked":
        this.metrics.fraudBlocked++;
        break;

      case "fee.applied":
        this.metrics.totalRevenue +=
          event.payload.amount || 0;
        break;

      case "affiliate.rewarded":
        this.metrics.affiliatePaid +=
          event.payload.reward || 0;
        break;

      case "crypto.routed":
        this.metrics.cryptoVolume +=
          event.payload.amount || 0;
        break;

      case "fiat.routed":
        this.metrics.fiatVolume +=
          event.payload.amount || 0;
        break;
    }

    return {
      ok: true
    };
  }

  snapshot() {

    return {
      ok: true,
      metrics: this.metrics
    };
  }
}

module.exports = new AnalyticsAggregateV10_1();
