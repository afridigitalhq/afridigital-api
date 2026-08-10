import { mountWS } from "./ws/init-ws.js";

export function mountWebsocket(server){
  return mountWS(server);
}
