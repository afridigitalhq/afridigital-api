const DECISIONS = Object.freeze({
  WAIT: "WAIT",
  HOLD: "HOLD",
  CLOSE: "CLOSE",
  REVERSE: "REVERSE"
});

const MIN_REVERSAL_CONFIDENCE = 75;
const STRONG_REVERSAL_CONFIDENCE = 82;
const MIN_REVERSAL_SCORE = 4;

function number(value, fallback = null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeDirection(value) {
  const direction = String(value || "").toUpperCase();

  if (["BUY", "STRONG_BUY"].includes(direction)) return "BUY";
  if (["SELL", "STRONG_SELL"].includes(direction)) return "SELL";

  return null;
}

function opposite(directionA, directionB) {
  return Boolean(directionA && directionB && directionA !== directionB);
}

function decide({
  position = null,
  signal = null,
  multiTimeframeAnalysis = null
} = {}) {
  if (!signal) {
    return {
      decision: DECISIONS.WAIT,
      reason: "NO_NEW_SIGNAL"
    };
  }

  const newDirection = normalizeDirection(signal.signal);

  if (!newDirection || !signal.tradeable) {
    return {
      decision: DECISIONS.WAIT,
      currentDirection: normalizeDirection(position?.direction),
      newDirection,
      confidence: number(signal.confidence, 0),
      reason: "NEW_SIGNAL_NOT_TRADEABLE"
    };
  }

  if (!position) {
    return {
      decision: DECISIONS.WAIT,
      currentDirection: null,
      newDirection,
      confidence: number(signal.confidence, 0),
      reason: "NO_EXISTING_POSITION"
    };
  }

  const currentDirection = normalizeDirection(position.direction);

  if (!currentDirection) {
    return {
      decision: DECISIONS.WAIT,
      currentDirection: null,
      newDirection,
      confidence: number(signal.confidence, 0),
      reason: "EXISTING_POSITION_DIRECTION_UNAVAILABLE"
    };
  }

  if (!opposite(currentDirection, newDirection)) {
    return {
      decision: DECISIONS.HOLD,
      currentDirection,
      newDirection,
      confidence: number(signal.confidence, 0),
      reason: "SAME_DIRECTION_SIGNAL"
    };
  }

  const confidence = number(signal.confidence, 0);
  const analysis = multiTimeframeAnalysis || {};

  const primaryScore = number(analysis.primaryScore, 0);
  const confirmationScore = number(analysis.confirmationScore, 0);
  const higherScore = number(analysis.higherTimeframeScore, 0);
  const entryScore = number(analysis.entryScore, 0);

  const expectedPrimary = newDirection === "BUY" ? 1 : -1;
  const expectedConfirmation = newDirection === "BUY" ? 1 : -1;

  const primaryAligned = primaryScore === expectedPrimary;
  const confirmationAligned = confirmationScore === expectedConfirmation;
  const higherAligned =
    higherScore === 0 || Math.sign(higherScore) === expectedPrimary;
  const entryAligned =
    entryScore === 0 || Math.sign(entryScore) === expectedPrimary;

  const signalIsStrong =
    signal.signal === "STRONG_BUY" ||
    signal.signal === "STRONG_SELL";

  const confidencePassed = confidence >= MIN_REVERSAL_CONFIDENCE;

  let reversalScore = 0;

  if (confidencePassed) reversalScore += 2;
  if (signalIsStrong) reversalScore += 1;
  if (primaryAligned) reversalScore += 1;
  if (confirmationAligned) reversalScore += 1;
  if (higherAligned) reversalScore += 1;
  if (entryAligned) reversalScore += 1;

  const strongConfirmation =
    confidence >= STRONG_REVERSAL_CONFIDENCE &&
    primaryAligned &&
    confirmationAligned &&
    reversalScore >= MIN_REVERSAL_SCORE;

  if (strongConfirmation) {
    return {
      decision: DECISIONS.REVERSE,
      currentDirection,
      newDirection,
      confidence,
      reversalScore,
      reason: "STRONG_OPPOSING_MULTI_TIMEFRAME_SIGNAL",
      checks: {
        oppositeDirection: true,
        confidenceThreshold: confidencePassed,
        primaryConfirmationAligned:
          primaryAligned && confirmationAligned,
        higherTimeframeSupport: higherAligned,
        entryTimeframeSupport: entryAligned,
        strongSignal: signalIsStrong
      }
    };
  }

  if (confidencePassed && primaryAligned && confirmationAligned) {
    return {
      decision: DECISIONS.CLOSE,
      currentDirection,
      newDirection,
      confidence,
      reversalScore,
      reason: "OPPOSING_SIGNAL_REQUIRES_POSITION_EXIT",
      checks: {
        oppositeDirection: true,
        confidenceThreshold: true,
        primaryConfirmationAligned: true,
        higherTimeframeSupport: higherAligned,
        entryTimeframeSupport: entryAligned,
        strongSignal: signalIsStrong
      }
    };
  }

  return {
    decision: DECISIONS.HOLD,
    currentDirection,
    newDirection,
    confidence,
    reversalScore,
    reason: "OPPOSING_SIGNAL_NOT_STRONG_ENOUGH",
    checks: {
      oppositeDirection: true,
      confidenceThreshold: confidencePassed,
      primaryConfirmationAligned: primaryAligned,
      confirmationAligned,
      higherTimeframeSupport: higherAligned,
      entryTimeframeSupport: entryAligned,
      strongSignal: signalIsStrong
    }
  };
}

const AfriForexPositionDecisionEngine = Object.freeze({
  DECISIONS,
  decide
});

export default AfriForexPositionDecisionEngine;
