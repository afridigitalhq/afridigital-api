const { TimelineIndexer } = require("../timeline/indexer");
const { CausalGraph } = require("../causal/graph");
const { LoadPredictor } = require("../predictor/load.model");
const { buildWebGLPayload } = require("../webgl/feed.adapter");

class ControlPlaneBridge {
  constructor() {
    this.timeline = new TimelineIndexer();
    this.graph = new CausalGraph();
    this.predictor = new LoadPredictor();
  }

  ingest(event) {
    const t = this.timeline.index(event);
    return t;
  }

  snapshot() {
    const events = this.timeline.getTimeline();
    const prediction = this.predictor.estimate(events);

    return buildWebGLPayload(events, this.graph.snapshot(), prediction);
  }
}

module.exports = { ControlPlaneBridge };
