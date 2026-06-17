export const WS_URL = "wss://afridigital-fmdash.onrender.com";

export class WSClient {
  constructor() {
    this.ws = null;
    this.listeners = new Set();
  }

  connect() {
    this.ws = new WebSocket(this.ws ? this.ws.url : WS_URL);

    this.ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        this.listeners.forEach(fn => fn(data));
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
