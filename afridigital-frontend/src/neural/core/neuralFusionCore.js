import { correlateSignals } from "../correlation/crossObsCorrelation";
import { clusterAnomalies } from "../learning/anomalyClusterAI";
import { replaySystem } from "../replay/digitalTwinReplay";

export function buildNeuralState(input) {
  const correlations = correlateSignals(input.observations);
  const anomalies = clusterAnomalies(input.events);
  const replay = replaySystem(input.events, input.timestamp);

  const narrative =
    correlations.correlations.length > 0
      ? "Cross-system dependencies detected between operational domains."
      : "System operating with low inter-domain coupling."

  return {
    brain: {
      anomalies,
      replayState: replay.snapshot,
      correlations: correlations.correlations
    },
    narrative,
    activeUniverse: replay.mode,
    mode: "NEURAL_SYSTEM_FUSION"
  };
}
