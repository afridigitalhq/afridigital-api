/**
 * ⚡ A3.17 EVOLUTION WEBSOCKET GATEWAY
 * Real-time evolution push system (no polling)
 */

const clients = new Set();

function attachEvolutionGateway(wss) {

  wss.on("connection", (ws) => {
    clients.add(ws);

    ws.on("close", () => clients.delete(ws));
  });
}

function pushEvolution(event) {
  for (const ws of clients) {
    try {
      ws.send(JSON.stringify({
        channel: "EVOLUTION_STREAM",
        payload: event
      }));
    } catch (e) {}
  }
}

module.exports = { attachEvolutionGateway, pushEvolution };
