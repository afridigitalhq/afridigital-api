import {
  AFRIFOREX_SIGNAL_STATES
} from "../contracts/AfriForexTradingContracts.js";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const AfriForexSignalEngine = {
  evaluateMultiTimeframe(analysis = {}, price = null, symbol = null) {
    if (!analysis || analysis.status !== "AVAILABLE") {
      return {
        signal: "WAIT",
        state: "WAIT",
        confidence: 0,
        tradeable: false,
        reason: "INSUFFICIENT_MULTI_TIMEFRAME_DATA"
      };
    }

    const primary = Number(analysis.primaryScore) || 0;
    const confirmation = Number(analysis.confirmationScore) || 0;
    const higher = Number(analysis.higherTimeframeScore) || 0;
    const entry = Number(analysis.entryScore) || 0;

    let signal = "WAIT";

    if (primary > 0 && confirmation >= 0) {
      signal = "BUY";
    } else if (primary < 0 && confirmation <= 0) {
      signal = "SELL";
    }

    const alignment =
      primary +
      confirmation +
      Math.sign(higher) +
      Math.sign(entry);

    const confidence = clamp(
      Number(analysis.confidence) || 0,
      0,
      95
    );

    return {
      signal,
      state: signal,
      confidence,
      ...(symbol ? { symbol } : {}),
      ...(Number.isFinite(Number(price)) ? { price: Number(price) } : {}),
      tradeable: signal !== "WAIT",
      score: alignment,
      primaryTimeframe: analysis.primaryTimeframe || "4H",
      confirmationTimeframe: analysis.confirmationTimeframe || "1H",
      primaryScore: primary,
      confirmationScore: confirmation,
      higherTimeframeScore: higher,
      entryScore: entry,
      availableTimeframes: analysis.availableTimeframes || [],
      reason: signal === "WAIT"
        ? "PRIMARY_CONFIRMATION_NOT_ALIGNED"
        : "MULTI_TIMEFRAME_ALIGNMENT"
    };
  },

  evaluate(market = {}) {
    const evidence = Array.isArray(market.evidence)
      ? market.evidence
      : [];

    if (market.multiTimeframeAnalysis) {
      const prices = evidence
        .map(item => item?.evidence || item)
        .filter(item => item?.status === "AVAILABLE" && item?.data)
        .map(item => Number(item.data.price))
        .filter(Number.isFinite);

      return this.evaluateMultiTimeframe(
        market.multiTimeframeAnalysis,
        prices[0] ?? null,
        market.symbol || null
      );
    }

    const usable = evidence
      .map(item => item?.evidence || item)
      .filter(item => item?.status === "AVAILABLE" && item?.data);

    if (!usable.length) {
      return {
        signal: "WAIT",
        state: "WAIT",
        confidence: 0,
        tradeable: false,
        reason: "NO_USABLE_MARKET_EVIDENCE"
      };
    }

    const prices = usable
      .map(item => item.data)
      .filter(data => Number.isFinite(data.price));

    if (!prices.length) {
      return {
        signal: "WAIT",
        state: "WAIT",
        confidence: 0,
        tradeable: false,
        reason: "NO_VALID_PRICE"
      };
    }

    const data = prices[0];

    const changePercent = Number.isFinite(data.changePercent)
      ? data.changePercent
      : 0;

    const price = data.price;
    const open = data.open;
    const high = data.high;
    const low = data.low;

    if (!Number.isFinite(price) || !Number.isFinite(open)) {
      return {
        signal: "WAIT",
        state: "WAIT",
        confidence: 0,
        tradeable: false,
        reason: "INSUFFICIENT_QUOTE_FIELDS"
      };
    }

    const intradayMove =
      open !== 0
        ? ((price - open) / open) * 100
        : 0;

    const range =
      Number.isFinite(high) &&
      Number.isFinite(low) &&
      high > low
        ? high - low
        : 0;

    const rangePosition =
      range > 0
        ? (price - low) / range
        : 0.5;

    let score = 0;
    const reasons = [];

    if (changePercent > 0.25) {
      score += 1;
      reasons.push("positive market change");
    } else if (changePercent < -0.25) {
      score -= 1;
      reasons.push("negative market change");
    }

    if (intradayMove > 0.15) {
      score += 1;
      reasons.push("price is above the session open");
    } else if (intradayMove < -0.15) {
      score -= 1;
      reasons.push("price is below the session open");
    }

    if (rangePosition > 0.65) {
      score += 1;
      reasons.push("price is in the upper part of the observed range");
    } else if (rangePosition < 0.35) {
      score -= 1;
      reasons.push("price is in the lower part of the observed range");
    }

    let signal = "WAIT";

    if (score >= 3) signal = "STRONG_BUY";
    else if (score >= 1) signal = "BUY";
    else if (score <= -3) signal = "STRONG_SELL";
    else if (score <= -1) signal = "SELL";

    const confidence = clamp(
      50 + Math.abs(score) * 12,
      0,
      86
    );

    const tradeable =
      signal !== "WAIT" &&
      usable.length > 0;

    return {
      signal,
      state:
        signal === "STRONG_BUY" ? "STRONG_BUY" :
        signal === "BUY" ? "BUY" :
        signal === "SELL" ? "SELL" :
        signal === "STRONG_SELL" ? "STRONG_SELL" :
        AFRIFOREX_SIGNAL_STATES[2],
      confidence,
      tradeable,
      score,
      evidenceCount: usable.length,
      price,
      changePercent,
      intradayMove,
      rangePosition,
      reason: reasons.length
        ? reasons.join("; ")
        : "Market evidence is currently insufficient for a directional trade."
    };
  }
};

export default AfriForexSignalEngine;
