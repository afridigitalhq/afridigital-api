const attachAfriAIWebSocket = require("./ws/afriai.ws");

module.exports = {
  mount(app, server, WebSocketServer) {
    require("./routes/afriai.route")(app);
    attachAfriAIWebSocket(server, WebSocketServer);
  }
};
