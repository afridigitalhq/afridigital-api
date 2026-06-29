export class SOCWebSocketBridge {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.listeners = [];
  }

  connect() {
    this.socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      this.listeners.forEach(fn => fn(data));
    };
  }

  onEvent(fn) {
    this.listeners.push(fn);
  }
}
