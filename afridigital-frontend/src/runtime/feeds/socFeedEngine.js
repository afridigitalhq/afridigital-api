// LIVE SOC FEED ENGINE (BRIDGE LAYER)

import { buildSOCView } from "../../bridge/soc/socPipelineBridge";

let listeners = [];

export function subscribeSOC(callback) {
  listeners.push(callback);
}

export function pushSOCEvent(event) {
  const state = buildSOCView([event]);

  listeners.forEach(cb => cb(state));
}
