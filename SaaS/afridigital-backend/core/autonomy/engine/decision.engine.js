const { assertApiVersion } = require("../runtime/safety/api.guard");
const { getFeedback } =
require('../feedback/feedback.collector');

function calculateWeights() {

  const workflow =
    getFeedback('workflow');

  const ads =
    getFeedback('ads');

  return {
    workflowWeight: workflow.length,
    adWeight: ads.length
  };
}

module.exports = {
  calculateWeights
};
