export class AfriscanWS {
  constructor(url = "ws://localhost:9090") {
    this.url = url;
    this.ws = null;
    this.listeners = new Set();
    this.nodes = [];
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("🧠 AFRISCAN GRAPH CONNECTED");
    };

    this.ws.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data);

        const node = {
          id: Date.now(),
          type: event.type,
          payload: event.payload,
          ts: event.ts
        };

        this.nodes.push(node);
        this.emit(node);
      } catch (e) {
        console.log("📡 RAW EVENT:", msg.data);
      }
    };

    this.ws.onclose = () => {
      console.log("⚠️ GRAPH DISCONNECTED — reconnecting...");
      setTimeout(() => this.connect(), 2000);
    };
  }

  emit(node) {
    this.listeners.forEach((fn) => fn(node, this.nodes));
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}
