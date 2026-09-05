function number(value) {
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function normalize(home, draw, away) {
  const values = [number(home), number(draw), number(away)];

  if (
    values.some((value) => value === null) ||
    values.every((value) => value === 0)
  ) {
    return null;
  }

  const total = values.reduce(
    (sum, value) => sum + Math.max(value, 0),
    0
  ) || 1;

  return {
    home: Number(((Math.max(values[0], 0) / total) * 100).toFixed(2)),
    draw: Number(((Math.max(values[1], 0) / total) * 100).toFixed(2)),
    away: Number(((Math.max(values[2], 0) / total) * 100).toFixed(2))
  };
}

export function buildProviderConsensus(providerResults = []) {
  const successful = providerResults.filter(
    (item) => item?.status === "fulfilled" && item?.result
  );

  const evidence = successful
    .map((item) => {
      const result = item.result;

      const probabilities = normalize(
        result?.probabilities?.home,
        result?.probabilities?.draw,
        result?.probabilities?.away
      );

      return {
        provider: item.provider,
        probabilities,
        markets: result?.markets ?? {},
        expectedGoals: result?.expectedGoals ?? null,
        correctScore: result?.correctScore ?? null,
        metadata: result?.metadata ?? {}
      };
    })
    .filter((item) => item.probabilities);

  if (!evidence.length) {
    return Object.freeze({
      providerCount: 0,
      providers: [],
      probabilities: null,
      agreement: null,
      evidence: []
    });
  }

  const probabilities = {
    home: Number(
      (
        evidence.reduce(
          (sum, item) => sum + item.probabilities.home,
          0
        ) / evidence.length
      ).toFixed(2)
    ),
    draw: Number(
      (
        evidence.reduce(
          (sum, item) => sum + item.probabilities.draw,
          0
        ) / evidence.length
      ).toFixed(2)
    ),
    away: Number(
      (
        evidence.reduce(
          (sum, item) => sum + item.probabilities.away,
          0
        ) / evidence.length
      ).toFixed(2)
    )
  };

  const agreement = {
    homeRange: Number(
      (
        Math.max(
          ...evidence.map((item) => item.probabilities.home)
        ) -
        Math.min(
          ...evidence.map((item) => item.probabilities.home)
        )
      ).toFixed(2)
    ),
    drawRange: Number(
      (
        Math.max(
          ...evidence.map((item) => item.probabilities.draw)
        ) -
        Math.min(
          ...evidence.map((item) => item.probabilities.draw)
        )
      ).toFixed(2)
    ),
    awayRange: Number(
      (
        Math.max(
          ...evidence.map((item) => item.probabilities.away)
        ) -
        Math.min(
          ...evidence.map((item) => item.probabilities.away)
        )
      ).toFixed(2)
    )
  };

  return Object.freeze({
    providerCount: evidence.length,
    providers: Object.freeze(
      evidence.map((item) => item.provider)
    ),
    probabilities: Object.freeze(probabilities),
    agreement: Object.freeze(agreement),
    evidence: Object.freeze(evidence)
  });
}

export default Object.freeze({
  buildProviderConsensus
});
