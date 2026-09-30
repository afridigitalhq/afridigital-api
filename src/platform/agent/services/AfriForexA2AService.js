import AfriForexTradingOrchestrator
  from "../../../../modules/afriforex/orchestration/AfriForexTradingOrchestrator.js";

const AfriForexA2AService = {

  async analyze(payload = {}, context = {}) {

    const customerId =
      String(payload.customerId || context.customerId || "guest");

    const markets =
      Array.isArray(payload.markets)
        ? payload.markets
        : null;

    const crossAssetEnabled =
      payload.crossAssetEnabled === true;

    const result =
      await AfriForexTradingOrchestrator.scan(
        customerId,
        markets,
        crossAssetEnabled
      );

    return {
      service: "AfriForex",
      capability: "market.analyze",
      status: result?.status || "COMPLETED",
      analysis: result
    };

  }

};

export default AfriForexA2AService;
