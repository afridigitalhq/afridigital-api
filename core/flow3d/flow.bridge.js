const { registerFlow } = require('../neural-atlas/atlas.engine');

function emitFlow3D(from, to, meta = {}) {
  return {
    from,
    to,
    weight: meta.weight || 1,
    pulse: meta.pulse || Math.random(),
    timestamp: Date.now()
  };
}

function wireFlow3D(bus) {
  bus.on('FLOW_EVENT', (data) => {
    registerFlow(data.from, data.to, data.success);
  });
}

module.exports = { emitFlow3D, wireFlow3D };
