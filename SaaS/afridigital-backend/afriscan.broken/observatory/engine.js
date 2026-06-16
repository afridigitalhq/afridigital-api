const registry = require('../control/registry');
const { computeScore } = require('./score.engine');

function runObservatory() {
  const pipeline = registry.collector();

  const scoreData = computeScore(pipeline);

  const state =
    scoreData.score >= 70 ? 'STABLE' :
    scoreData.score >= 40 ? 'DEGRADED' :
    'CRITICAL';

  return {
    ...pipeline,
    score: scoreData.score,
    breakdown: scoreData.breakdown,
    state,
    mode: 'OBS',
    version: 'v3'
  };
}

module.exports = { runObservatory };
