import AFRIFOREX_INSTRUMENT_SPECS from "./AfriForexInstrumentSpecs.js";

function round(value, decimals = 8) {
  const factor = 10 ** decimals;
  return Math.round(Number(value) * factor) / factor;
}

function getSpec(symbol) {
  const rawSymbol = String(symbol || "").trim().toUpperCase();

  const aliases = {
    "BINANCE:XRPUSDT": "XRP/USDT",
    "XRPUSDT": "XRP/USDT",
    "BINANCE:BTCUSDT": "BTC/USDT",
    "BTCUSDT": "BTC/USDT",
    "BINANCE:ETHUSDT": "ETH/USDT",
    "ETHUSDT": "ETH/USDT"
  };

  const canonicalSymbol =
    aliases[rawSymbol] || rawSymbol;

  return AFRIFOREX_INSTRUMENT_SPECS[canonicalSymbol] || null;
}

function normalizeLot(lotSize, spec) {
  const lot = Number(lotSize);

  if (!Number.isFinite(lot) || lot <= 0) {
    return { status: "REJECTED", reason: "INVALID_LOT_SIZE" };
  }

  if (lot < spec.minLot) {
    return {
      status: "REJECTED",
      reason: "LOT_SIZE_BELOW_MINIMUM",
      requestedLotSize: lot,
      minLot: spec.minLot
    };
  }

  if (lot > spec.maxLot) {
    return {
      status: "REJECTED",
      reason: "LOT_SIZE_ABOVE_MAXIMUM",
      requestedLotSize: lot,
      maxLot: spec.maxLot
    };
  }

  const steps = Math.round((lot - spec.minLot) / spec.lotStep);
  const normalizedLot = spec.minLot + steps * spec.lotStep;

  if (Math.abs(normalizedLot - lot) > 1e-9) {
    return {
      status: "REJECTED",
      reason: "LOT_SIZE_NOT_ON_ALLOWED_STEP",
      requestedLotSize: lot,
      minLot: spec.minLot,
      lotStep: spec.lotStep
    };
  }

  return {
    status: "VALID",
    lotSize: round(normalizedLot, 8)
  };
}

const AfriForexLotCalculator = {
  resolve(symbol) {
    const spec = getSpec(symbol);

    if (!spec) {
      return {
        status: "REJECTED",
        reason: "INSTRUMENT_NOT_SUPPORTED",
        symbol
      };
    }

    return {
      status: "AVAILABLE",
      symbol: spec.canonicalSymbol,
      spec
    };
  },

  calculate(symbol, lotSize) {
    const spec = getSpec(symbol);

    if (!spec) {
      return {
        status: "REJECTED",
        reason: "INSTRUMENT_NOT_SUPPORTED",
        symbol
      };
    }

    const normalized = normalizeLot(lotSize, spec);

    if (normalized.status !== "VALID") {
      return {
        ...normalized,
        symbol: spec.canonicalSymbol
      };
    }

    const quantity = normalized.lotSize * spec.contractSize;

    return {
      status: "CALCULATED",
      symbol: spec.canonicalSymbol,
      assetType: spec.assetType,
      lotSize: normalized.lotSize,
      contractSize: spec.contractSize,
      quantity: round(quantity, 8),
      quantityUnit: spec.quantityUnit
    };
  }
};

export default AfriForexLotCalculator;
