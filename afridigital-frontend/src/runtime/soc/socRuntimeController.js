// SOC RUNTIME CONTROLLER (LIVE PIPELINE ORCHESTRATOR)

import { subscribeSOC } from "../feeds/socFeedEngine";

export function initSOCRuntime(setState) {
  subscribeSOC((socState) => {
    setState(prev => ({
      ...prev,
      soc: socState
    }));
  });
}
