import AfriForexTradingOrchestrator from "../orchestration/AfriForexTradingOrchestrator.js";
import AfriForexDemoStore from "../storage/AfriForexDemoStore.js";

const DEFAULT_INTERVAL_MS = 60_000;

const AfriForexLiveEngine = {
  timer: null,
  running: false,
  scanning: false,

  async cycle(customerId = "guest", markets = null) {
    if (this.scanning) {
      return {
        status: "SKIPPED",
        reason: "SCAN_ALREADY_RUNNING"
      };
    }

    const preferences = AfriForexDemoStore.getPreferences(customerId);

    const monitoredMarkets =
      Array.isArray(markets)
        ? markets
        : Array.isArray(preferences.monitoredMarkets)
          ? preferences.monitoredMarkets
          : [];

    if (!monitoredMarkets.length) {
      console.log(
        `🟡 AfriForex Live Engine → NO_MONITORED_MARKETS | customer=${customerId}`
      );

      return {
        status: "IDLE",
        reason: "NO_MONITORED_MARKETS",
        customerId,
        marketsScanned: []
      };
    }

    this.scanning = true;

    try {
      console.log(
        `📡 AfriForex Live Engine MONITORING → ${monitoredMarkets.join(", ")}`
      );

      return await AfriForexTradingOrchestrator.scan(
        customerId,
        monitoredMarkets,
        false,
        { source: "MONITORED" }
      );
    } finally {
      this.scanning = false;
    }
  },

  start({
    customerId = "guest",
    markets = null,
    intervalMs = DEFAULT_INTERVAL_MS,
    runImmediately = true
  } = {}) {
    if (this.running) {
      return {
        status: "ALREADY_RUNNING"
      };
    }

    this.running = true;

    const execute = async () => {
      try {
        await this.cycle(customerId, markets);
      } catch (error) {
        console.error("AfriForex live scan error:", error);
      }
    };

    if (runImmediately) {
      void execute();
    }

    this.timer = setInterval(execute, intervalMs);

    console.log(
      `📈 AfriForex Live Engine ACTIVE → ${intervalMs}ms`
    );

    return {
      status: "STARTED",
      customerId,
      intervalMs
    };
  },

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.running = false;
    this.scanning = false;

    console.log("📉 AfriForex Live Engine STOPPED");

    return {
      status: "STOPPED"
    };
  }
};

export default AfriForexLiveEngine;
