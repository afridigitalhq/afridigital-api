import { createRequire } from "module";

const require = createRequire(import.meta.url);

export function mountWSRuntime(server){
  const { initWS } = require("../core/realtime/ws/stream.bridge.cjs");
  return initWS(server);
}
