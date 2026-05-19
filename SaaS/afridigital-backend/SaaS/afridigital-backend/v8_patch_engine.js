const fs = require('fs');

const file = './core/afriai/v10_5/observability/trace.bus.v10.5.js';
let c = fs.readFileSync(file, 'utf8');

// V8 SAFE LANE ENGINE (no syntax injection risks)
if (!c.includes('laneMetrics')) {
  c += `

/* =========================
   V8 MULTI-AGENT LANE CORE
   ========================= */

class LaneEngine {
  constructor() {
    this.lanes = {
      FAST: [],
      BALANCED: [],
      FINANCE: []
    };
  }

  route(event) {
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

console.log('🚀 V8 LANE ENGINE ACTIVE');
`;
}

fs.writeFileSync(file, c);
console.log('✅ V8 PATCH APPLIED SAFELY');
