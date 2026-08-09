const attachAfriAIWebSocket = require("./ws/afriai.ws.cjs");

const { bootstrapAfriAI } = require("../../bootstrap/ws-integration/output/afriai-ws-bootstrap.cjs");
bootstrapAfriAI(attachAfriAIWebSocket);


module.exports = {
  mount(app, server, WebSocketServer) {
    require("./routes/afriai.route")(app);
    attachAfriAIWebSocket(server, WebSocketServer);
  }
};
