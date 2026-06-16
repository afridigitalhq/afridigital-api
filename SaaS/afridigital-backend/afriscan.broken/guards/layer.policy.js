module.exports = {
  pipeline: {
    allowConsole: false,
    allowUI: false,
    allowRender: false,
    description: "PURE DATA ONLY"
  },
  format: {
    allowConsole: false,
    allowUI: false,
    allowRender: false,
    allowStringUI: false,
    description: "TRANSFORM ONLY (NO UI)"
  },
  renderer: {
    allowConsole: true,
    allowUI: true,
    allowRender: true,
    description: "ONLY LAYER ALLOWED TO RENDER UI"
  }
};
