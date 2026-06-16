const graph = require("./tools/afriscan-v12");

// ===== AFRISCAN SELF-HEALING OBSERVER LAYER (SAFE) =====
graph.meta = graph.meta || {};
graph.meta.healthMode = "v1_observer";

function computeHealth(state) {
  const nodes = state.nodes || 0;
  const ok = state.ok || 0;
  const failed = state.failed || 0;

  const stability = nodes ? ok / nodes : 0;
  const penalty = failed * 0.15;

  const score = Math.max(0, stability - penalty);

  let status = "READY";
  if (score < 0.7) status = "DEGRADED";
  if (score < 0.4) status = "CRITICAL";

  return {
    ...state,
    score,
    status,
    suggestions: failed > 0 ? ["restart-risk-nodes", "check-event-stream"] : []
  };
}

graph.computeHealth = computeHealth;
graph.meta = graph.meta || {}; 
graph.meta.version = "v12.5_event_graph"; 
graph.meta.lastBoot = Date.now(); 
graph.meta.mode = "render-prod";
graph.meta = graph.meta || {}; 
graph.meta.version = "v12.5_event_graph"; 
graph.meta.lastBoot = Date.now(); 
graph.meta.mode = "render-prod";
const express = require("express");
const graph = require("./tools/afriscan-v12");

// ===== LIGHTWEIGHT REGISTRY LAYER (SAFE EXTENSION) =====
const nodeWeights = { redis: 1, ai: 1, afriscan: 1 };
function computeWeightedHealth(state) {
  const nodes = state.nodes || 3;
  const ok = state.ok || 0;
  const weightTotal = Object.values(nodeWeights).reduce((a,b)=>a+b,0);
  const score = weightTotal > 0 ? (ok / nodes) * weightTotal : 0;
  return { ...state, weightedScore: score, model: "V12_WEIGHTED_SAFE_LAYER" };
}

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

graph.register("redis", async () => {});
graph.register("ai", async () => {});
graph.register("afriscan", async () => {});


// ===== ENSURE ROUTES REGISTER BEFORE GRAPH EXECUTION =====
app.get("/status", (_, res) => {
  res.json({
    state: graph.getState ? graph.getState() : null,
    snapshots: graph.snapshots || []
  });
});
  res.json({
    state: graph.getState ? graph.getState() : null,
    snapshots: graph.snapshots || []
  });
});

graph.run();

app.get("/", (_, res) => {
  res.json({
    ok: true,
    kernel: "V12.5_EVENT_GRAPH",
    state: graph.getState()
  });
});

app.get("/health", (_, res) => {
  const state = graph.snapshots.at(-1) || graph.getState();
  res.json(graph.computeHealth ? graph.computeHealth(state) : state);
});
  const state = graph.snapshots.at(-1) || graph.getState();
  res.json(graph.computeHealth ? graph.computeHealth(state) : state);
graph.meta = graph.meta || {}; 
graph.meta.version = "v12.5_event_graph"; 
graph.meta.lastBoot = Date.now(); 
graph.meta.mode = "render-prod";
graph.meta = graph.meta || {}; 
graph.meta.version = "v12.5_event_graph"; 
graph.meta.lastBoot = Date.now(); 
graph.meta.mode = "render-prod";
});


// ===== AFRISCAN RUNTIME ACTIVATION LAYER (SAFE) =====
setInterval(() => {
  try {
    const g = graph;
    const state = g.getState ? g.getState() : {};
    g.snapshots = g.snapshots || [];
    g.snapshots.push({
      time: Date.now(),
      nodes: state.nodes || 3,
      ok: state.ok || 3,
      failed: state.failed || 0
    });
  } catch (e) {}
}, 15000);

app.get("/meta", (_, res) => {
  res.json(graph.meta || {});
});

  res.json({
    state: graph.getState ? graph.getState() : null,
    snapshots: graph.snapshots || []
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 V12.5 EVENT GRAPH ONLINE:", PORT);
});
