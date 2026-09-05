import {predictMatch} from "../../../modules/afriai/prediction/orchestration/AfriPredictionOrchestrator.js";
import {registerDefaultFootballProviders} from "../../../modules/football/registry/registerFootballProviders.js";

async function resolveLiveFixture(fixtureId) {
  const providers = registerDefaultFootballProviders();
  const provider =
    providers.find(item => item.name === "APIfootball") ||
    providers.find(item => item.supports?.("fixture"));

  if (!provider?.supports?.("fixture")) {
    return null;
  }

  const result = await provider.execute("fixture", fixtureId);
  const fixtures = Array.isArray(result)
    ? result
    : Array.isArray(result?.matches)
      ? result.matches
      : Array.isArray(result?.data)
        ? result.data
        : [];

  return (
    fixtures.find(item => String(item?.id) === String(fixtureId)) ||
    fixtures[0] ||
    null
  );
}

export async function getMatchPrediction(fixtureId,date,fixture={}){
  if(!fixtureId)throw new Error("Fixture ID is required");

  let liveFixture = null;

  try {
    liveFixture = await resolveLiveFixture(fixtureId);
  } catch(error) {
    console.warn(
      `AFRIAI LIVE FIXTURE LOOKUP FAILED FOR ${fixtureId}:`,
      error?.message || error
    );
  }

  const resolvedFixture = liveFixture || fixture || {};

  const predictionInput = {
    ...resolvedFixture,
    ...fixture,
    fixtureId,
    homeTeam:
      liveFixture?.home?.name ??
      resolvedFixture?.home?.name ??
      fixture?.homeTeam ??
      null,
    awayTeam:
      liveFixture?.away?.name ??
      resolvedFixture?.away?.name ??
      fixture?.awayTeam ??
      null,
    league:
      liveFixture?.league?.name ??
      resolvedFixture?.league?.name ??
      fixture?.league ??
      null,
    season:
      liveFixture?.season ??
      resolvedFixture?.season ??
      fixture?.season ??
      null,
    liveState: liveFixture
      ? {
          status: liveFixture.status ?? null,
          minute: liveFixture.minute ?? null,
          score: liveFixture.score ?? null,
          events: liveFixture.events ?? [],
          metadata: liveFixture.metadata ?? {}
        }
      : fixture?.liveState ?? null
  };

  let result;

  try {
    result = await predictMatch(
      predictionInput,
      {provider:"APIfootball"}
    );
  } catch (predictionProviderError) {
    const isLive =
      predictionInput.liveState &&
      String(predictionInput.liveState.status ?? "")
        .toLowerCase() !== "finished" &&
      Number.isFinite(Number(predictionInput.liveState.minute));

    if (!isLive) {
      throw predictionProviderError;
    }

    console.warn(
      `AFRIAI LIVE FALLBACK FOR ${fixtureId}:`,
      predictionProviderError?.message || predictionProviderError
    );

    const {predictFromEvidence} =
      await import(
        "../../../modules/afriai/prediction/orchestration/AfriPredictionEvidenceEngine.js"
      );
    const {createPredictionEvidenceFromFixture} =
      await import(
        "../../../modules/afriai/prediction/providers/AfriPredictionEvidenceAdapter.js"
      );

    const evidence = createPredictionEvidenceFromFixture({
      fixture: {
        ...predictionInput,
        providerPredictions: []
      },
      source: [{
        provider: "APIfootball",
        status: "unavailable",
        error:
          predictionProviderError?.message ||
          "Prediction provider unavailable"
      }]
    });

    result = predictFromEvidence(evidence);

    result = {
      ...result,
      providerCount: 0,
      providerConsensus: {
        providerCount: 0,
        providers: [],
        probabilities: null,
        agreement: null,
        evidence: []
      },
      providerResults: [{
        provider: "APIfootball",
        status: "rejected",
        error:
          predictionProviderError?.message ||
          "Prediction provider unavailable"
      }]
    };
  }

  return {
    ...result,
    fixtureId,
    pipeline:"AFRI_AI_PREDICTION_ORCHESTRATOR",
    liveState: liveFixture
      ? {
          status: liveFixture.status ?? null,
          minute: liveFixture.minute ?? null,
          score: liveFixture.score ?? null,
          events: liveFixture.events ?? []
        }
      : fixture?.liveState ?? null,
    date:date??resolvedFixture?.kickoff?.slice?.(0,10)??null
  };
}

export default Object.freeze({getMatchPrediction});
