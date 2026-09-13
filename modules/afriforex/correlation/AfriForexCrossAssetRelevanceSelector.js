const MAX_CROSS_ASSET_CANDIDATES = 20;

const PRIORITY = Object.freeze({
  forex: [
    "EUR/USD","GBP/USD","USD/JPY","USD/CHF","AUD/USD",
    "NZD/USD","USD/CAD","EUR/JPY","GBP/JPY","AUD/JPY",
    "EUR/GBP","EUR/CHF","GBP/CHF","CAD/JPY","XAU/USD",
    "XAG/USD","WTI/USD","BTC/USDT","ETH/USDT","SPY"
  ],
  crypto: [
    "BTC/USDT","ETH/USDT","SOL/USDT","XRP/USDT","BNB/USDT",
    "DOGE/USDT","ADA/USDT","LINK/USDT","LTC/USDT","EUR/USD",
    "GBP/USD","USD/JPY","USD/CHF","XAU/USD","XAG/USD",
    "WTI/USD","SPY","QQQ","IWM","DIA"
  ],
  stock: [
    "SPY","QQQ","IWM","DIA","AAPL","MSFT","NVDA","AMZN",
    "META","TSLA","AMD","JPM","GS","XOM","CVX","XAU/USD",
    "WTI/USD","EUR/USD","USD/JPY","BTC/USDT"
  ],
  commodity: [
    "XAU/USD","XAG/USD","WTI/USD","BRENT/USD","NATURALGAS/USD",
    "COPPER/USD","EUR/USD","GBP/USD","USD/JPY","USD/CHF",
    "AUD/USD","CAD/JPY","BTC/USDT","ETH/USDT","SPY","QQQ",
    "XOM","CVX","CAT","JPM"
  ]
});

function select(symbol, assetType, universe) {
  const normalizedSymbol = String(symbol || "").trim().toUpperCase();
  const normalizedType = String(assetType || "").trim().toLowerCase();
  const priority = PRIORITY[normalizedType] || PRIORITY.forex;
  const available = new Map(
    (Array.isArray(universe) ? universe : []).map(asset => [
      String(asset.symbol || "").toUpperCase(),
      asset
    ])
  );

  const selected = [];

  for (const candidateSymbol of priority) {
    if (
      candidateSymbol === normalizedSymbol ||
      selected.length >= MAX_CROSS_ASSET_CANDIDATES
    ) {
      continue;
    }

    const candidate = available.get(candidateSymbol);

    if (candidate) {
      selected.push(candidate);
    }
  }

  if (selected.length < MAX_CROSS_ASSET_CANDIDATES) {
    for (const candidate of Array.isArray(universe) ? universe : []) {
      if (selected.length >= MAX_CROSS_ASSET_CANDIDATES) break;

      const candidateSymbol = String(candidate.symbol || "").toUpperCase();

      if (
        candidateSymbol === normalizedSymbol ||
        selected.some(
          item =>
            String(item.symbol || "").toUpperCase() === candidateSymbol
        )
      ) {
        continue;
      }

      selected.push(candidate);
    }
  }

  return Object.freeze(selected);
}

const AfriForexCrossAssetRelevanceSelector = Object.freeze({
  MAX_CROSS_ASSET_CANDIDATES,
  PRIORITY,
  select
});

export default AfriForexCrossAssetRelevanceSelector;
