const { handleAsk } = require("../../core/afriai/afriai.bridge");

/**
 * WebSocket AfriAI stream handler
 * lightweight + stateless transport
 */

function registerAfriAIWS(wss) {
  wss.on("connection", (ws) => {
    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        const result = handleAsk({
          sessionId: msg.sessionId,
          message: msg.message
        });

        ws.send(JSON.stringify({
          type: "afriai_response",
          data: result
        }));

      } catch (e) {
        ws.send(JSON.stringify({
          type: "error",
          error: "AFRIAI_WS_FAILED"
        }));
      }
    });
  });
}

module.exports = { registerAfriAIWS };
