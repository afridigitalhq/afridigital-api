import { WebSocketServer } from "ws";

let clients = new Set();

export function initAfriVisionStream(server){
  const wss = new WebSocketServer({ server, path: "/ws/afrivision" });

  wss.on("connection", (socket) => {
    clients.add(socket);
    console.log("📡 AfriVision CCTV client connected");

    socket.send(JSON.stringify({ type: "init", service: "AfriVision" }));

    socket.on("close", () => {
      clients.delete(socket);
      console.log("📴 AfriVision client disconnected");
    });
  });

  // simulate CCTV frames (temporary until real cameras attach)
  setInterval(() => {
    const frame = {
      ts: Date.now(),
      cameras: Math.floor(Math.random() * 12),
      status: "LIVE"
    };

    const payload = JSON.stringify({ type: "frame", data: frame });

    for (const c of clients) {
      if (c.readyState === 1) c.send(payload);
    }

  }, 2000);

  console.log("🎥 AfriVision CCTV Stream ACTIVE at /ws/afrivision");
}
