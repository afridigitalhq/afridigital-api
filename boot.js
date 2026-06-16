const express = require("express");
const graph = require("./tools/afriscan-v12");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

graph.register("redis", async () => {});
graph.register("ai", async () => {});
graph.register("afriscan", async () => {});

graph.run();

app.get("/", (_, res) => {
  res.json({
    ok: true,
    kernel: "V12.5_EVENT_GRAPH",
    state: graph.getState()
  });
});

app.get("/health", (_, res) => {
  res.json(graph.snapshots.at(-1) || graph.getState());
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 V12.5 EVENT GRAPH ONLINE:", PORT);
});
