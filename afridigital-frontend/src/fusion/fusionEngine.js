import { mapFusionState } from "./fusionMapper";
import { buildAnomalyOverlay } from "./anomalyOverlay";

export function buildFusionView({
  soc,
  heatmap,
  anomalies,
  rca,
  forecast
}) {
  return {
    fusion: mapFusionState({
      soc,
      heatmap,
      anomalies,
      rca,
      forecast
    }),

    overlays: {
      anomalies: buildAnomalyOverlay(anomalies)
    }
  };
}
