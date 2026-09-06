export const AFRIFOREX_INSTRUMENT_SPECS = {
  "EUR/USD": {
    canonicalSymbol: "EUR/USD",
    assetType: "forex",
    baseAsset: "EUR",
    quoteAsset: "USD",
    minLot: 0.01,
    lotStep: 0.01,
    maxLot: 60,
    contractSize: 100000,
    quantityUnit: "EUR",
    referenceModel: "HFM_MT5_STYLE"
  },
  "BTC/USDT": {
    canonicalSymbol: "BTC/USDT",
    assetType: "crypto",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    minLot: 0.01,
    lotStep: 0.01,
    maxLot: 50,
    contractSize: 1,
    quantityUnit: "BTC",
    referenceModel: "HFM_MT5_STYLE"
  },
  "ETH/USDT": {
    canonicalSymbol: "ETH/USDT",
    assetType: "crypto",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    minLot: 0.01,
    lotStep: 0.01,
    maxLot: 50,
    contractSize: 1,
    quantityUnit: "ETH",
    referenceModel: "HFM_MT5_STYLE"
  },
  "XRP/USDT": {
    canonicalSymbol: "XRP/USDT",
    assetType: "crypto",
    baseAsset: "XRP",
    quoteAsset: "USDT",
    minLot: 0.01,
    lotStep: 0.01,
    maxLot: 100,
    contractSize: 10000,
    quantityUnit: "XRP",
    referenceModel: "HFM_MT5_STYLE"
  }
};

export default AFRIFOREX_INSTRUMENT_SPECS;
