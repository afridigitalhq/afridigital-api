const FIELD = {
  clusters: {},
  heatMap: {},
  tick: 0
};

function updateField(event) {
  const service = event.service || "unknown";
  const heat = event.physics?.heat || 0;

  FIELD.clusters[service] = (FIELD.clusters[service] || 0) + 1;
  FIELD.heatMap[service] = (FIELD.heatMap[service] || 0) + heat;

  FIELD.tick++;

  if (FIELD.tick % 20 === 0) {
    for (let k in FIELD.heatMap) {
      FIELD.heatMap[k] *= 0.92;
    }
  }
}

function getFieldState() {
  return FIELD;
}

module.exports = { updateField, getFieldState };
