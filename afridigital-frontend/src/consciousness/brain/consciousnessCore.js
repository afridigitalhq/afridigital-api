import { explainSystem } from "../narrative/dagNarrator";
import { buildSystemConsciousness } from "../ui/systemConsciousness";
import { suggestRestructuring } from "./dependencyAdvisor";
import { buildTimelineNavigator } from "../navigation/timelineNavigator";

export function buildConsciousnessLayer(input) {
  const {
    events,
    probState,
    causalGraph,
    soc,
    radar,
    multiverse,
    recommendations
  } = input;

  const narrative = explainSystem(events, probState, causalGraph);
  const suggestions = suggestRestructuring(causalGraph);
  const timeline = buildTimelineNavigator(multiverse);

  const brain = buildSystemConsciousness({
    narrative,
    soc,
    radar,
    multiverse,
    recommendations
  });

  return {
    brain,
    narrative,
    suggestions,
    timeline,
    mode: "SYSTEM_CONSCIOUSNESS_LAYER"
  };
}
