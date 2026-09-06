import AfriTradingProviderAggregator from "../../afriai/trading/intelligence/AfriTradingProviderAggregator.js";
import AfriForexDemoStore from "../storage/AfriForexDemoStore.js";

function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

const AfriForexAccountValuation = {
  async value(customerId = "guest") {
    const account = AfriForexDemoStore.getAccount(customerId);
    const positions = AfriForexDemoStore.getOpenPositions(customerId);

    let unrealizedPnl = 0;
    const valuedPositions = [];

    for (const position of positions) {
      const evidence = await AfriTradingProviderAggregator.collect({
        assetType: position.assetType,
        symbol: position.symbol
      });

      const usable = evidence.results.find(
        result =>
          result.status === "AVAILABLE" &&
          result.evidence?.data?.price
      );

      const currentPrice = Number(
        usable?.evidence?.data?.price
      );

      if (!Number.isFinite(currentPrice)) {
        valuedPositions.push({
          ...position,
          currentPrice: null,
          unrealizedPnl: null,
          valuationStatus: "UNAVAILABLE"
        });
        continue;
      }

      const entryPrice = Number(position.entryPrice);
      const quantity = Number(position.quantity);

      const priceDifference =
        position.direction === "BUY"
          ? currentPrice - entryPrice
          : entryPrice - currentPrice;

      const positionPnl = priceDifference * quantity;

      unrealizedPnl += positionPnl;

      valuedPositions.push({
        ...position,
        currentPrice,
        unrealizedPnl: round(positionPnl, 2),
        valuationStatus: "AVAILABLE",
        valuationProvider: usable.provider
      });
    }

    const equity =
      Number(account.balance) + unrealizedPnl;

    const usedMargin = Number(account.usedMargin);

    const availableMargin =
      equity - usedMargin;

    return {
      accountId: account.accountId,
      customerId,
      mode: account.mode,
      currency: account.currency,
      balance: round(account.balance),
      equity: round(equity),
      unrealizedPnl: round(unrealizedPnl),
      usedMargin: round(usedMargin),
      availableMargin: round(availableMargin),
      activePositionCount: positions.length,
      positions: valuedPositions,
      valuedAt: new Date().toISOString()
    };
  }
};

export default AfriForexAccountValuation;
