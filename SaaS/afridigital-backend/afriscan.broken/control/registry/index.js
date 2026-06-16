const pipeline = require('../../runtime/core/pipeline');

function score() {
  const p = collector();
  return p?.score ?? 0;
}

function state() {
  const p = collector();
  return p?.state ?? 'UNKNOWN';
}

module.exports = {
  pipeline,
  score,
  state
};
