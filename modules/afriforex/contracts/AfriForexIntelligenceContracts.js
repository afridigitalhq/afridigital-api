export const AFRIFOREX_DIRECTIONS = [
  "STRONG_BUY",
  "BUY",
  "NEUTRAL",
  "SELL",
  "STRONG_SELL"
];

export const AFRIFOREX_SETUP_STATES = [
  "DEVELOPING",
  "CONFLICT",
  "ALIGNMENT_CONFIRMED",
  "ENTRY_TRIGGERED",
  "REVERSAL_DEVELOPING",
  "REVERSAL_CONFIRMED"
];

export const AFRIFOREX_TRADE_DECISIONS = [
  "WAIT",
  "ENTER",
  "HOLD",
  "CLOSE",
  "REVERSE"
];

export const AFRIFOREX_EVIDENCE_LAYERS = [
  "MTF",
  "INDICATORS",
  "MOMENTUM",
  "MARKET_STRUCTURE",
  "ECONOMIC_CALENDAR"
];

export function createAfriForexIntelligenceResult(input = {}) {
  return {
    symbol: input.symbol || null,
    direction: input.direction || "NEUTRAL",
    setupState: input.setupState || "DEVELOPING",
    tradeDecision: input.tradeDecision || "WAIT",
    reversal: input.reversal || {
      status: "NONE",
      direction: null
    },
    evidence: input.evidence || {},
    confidence: Number.isFinite(input.confidence)
      ? input.confidence
      : 0,
    reason: input.reason || null
  };
}
