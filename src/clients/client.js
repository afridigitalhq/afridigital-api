import { _validateAfriAIResponse, _safeParseAfriAI } from "../core/afriai/bootstrap.js";
export const WS_URL = "wss://afridigital-api.onrender.com";

export class WSClient {
  constructor() {
    this.ws = null;
    this.listeners = new Set();
  }

  connect() {
    this.ws = new WebSocket(this.ws ? this.ws.url : WS_URL);

    this.ws.onmessage = (msg) => {
      try {
        this.listeners.forEach(fn => fn(msg.data));
      } catch (e) {}
    };

    this.ws.onopen = () => {
      console.log("🟢 WS Connected");
    };
  }

  onEvent(fn) {
    this.listeners.add(fn);
  }
}
