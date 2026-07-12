import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { initWS } = require("../../core/realtime/ws/stream.bridge.js");

export function mountWS(server) {
  return initWS(server);
}
