export const eventStream = {
  socket: null,

  init() {
    this.socket = new WebSocket("wss://afridigital-api.onrender.com/events");

    this.socket.onmessage = (msg) => {
      console.log("📡 EVENT STREAM:", msg.data);
    };
  },

  send(event) {
    if (this.socket?.readyState === 1) {
      this.socket.send(JSON.stringify(event));
    }
  }
};
