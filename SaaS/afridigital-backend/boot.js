const express = require("express");
const graph = require("./tools/afriscan-v12");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* ===== ROUTES ===== */
app.get("/", (_, res) => {
  res.json({
    ok: true,
    kernel: "V12.5_EVENT_GRAPH",
    state: graph.getState?.()
  });
});

app.get("/health", (_, res) => {
  const state = graph.snapshots?.at(-1) || graph.getState?.();
  res.json({
    time: Date.now(),
    state
  });
});

app.get("/status", (_, res) => {
  res.json({
    state: graph.getState?.(),
    snapshots: graph.snapshots || []
  });
});

app.get("/meta", (_, res) => {
  res.json(graph.meta || {});
});

/* ===== GRAPH BOOT ===== */
graph.run?.();

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 EVENT GRAPH ONLINE:", PORT);
});
