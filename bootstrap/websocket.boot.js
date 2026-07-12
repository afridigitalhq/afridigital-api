import { WebSocketServer } from "ws";
import { mountWS } from "./ws/init-ws.js";

export function mountWebsocket(server){

  const wss = new WebSocketServer({
    server
  });

  mountWS(server);

  return wss;

}
