const fs = require('fs');

const file = './core/afriai/v10_5/observability/trace.bus.v10.5.js';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes('V8_LANE_STREAM')) {

const patch = `

// =======================
// V8 LANE STREAM ENGINE
// =======================

class LaneEngine {
  constructor() {
    this.lanes = {
      FAST: [],
      BALANCED: [],
      FINANCE: []
    };
  }

  route(event) {
    if (!event.stage) return 'BALANCED';
    if (event.stage === 'EXECUTOR') return 'FAST';
    if (event.stage === 'FINANCE') return 'FINANCE';
    return 'BALANCED';
  }

  assign(event) {
    const lane = this.route(event);
    this.lanes[lane].push(event);
    return lane;
  }
}

global.laneEngine = new LaneEngine();

// safe hook wrapper (no prototype hacking)
const originalEmit = module.exports.emit.bind(module.exports);

module.exports.emit = (event) => {
  const trace = originalEmit(event);

  const lane = global.laneEngine.assign(trace.event || event);

  trace.event.lane = lane;

  console.log('[V8_LANE]', JSON.stringify({
    id: trace.id,
    stage: trace.event.stage,
    lane
  }));

  return trace;
};

console.log('🚀 V8 FULL ACTIVE (SAFE MODE)');
`;

c += patch;
}

fs.writeFileSync(file, c);
console.log('✅ V8 ACTIVATION COMPLETE');
