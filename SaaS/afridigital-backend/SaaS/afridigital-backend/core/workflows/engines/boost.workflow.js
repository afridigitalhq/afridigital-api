const { assertApiVersion } = require("../runtime/safety/api.guard");
const workflow =
require('../state/workflow.state');

function startBoost(phone) {

  workflow.setWorkflow(phone, {
    type: 'BOOST',
    step: 'IMAGE'
  });

  return `
📢 BOOST CAMPAIGN STARTED

Send your product image.
`;
}

function continueBoost(phone, message) {

  const current =
    workflow.getWorkflow(phone);

  if (!current) return null;

  if (current.step === 'IMAGE') {

    current.image = message;
    current.step = 'DESCRIPTION';

    workflow.setWorkflow(
      phone,
      current
    );

    return `
📝 Image received.

Now send product description.
`;
  }

  if (
    current.step === 'DESCRIPTION'
  ) {

    current.description = message;
    current.step = 'COMPLETE';

    workflow.setWorkflow(
      phone,
      current
    );

    return `
🚀 BOOST SUBMITTED

Your campaign is now under review.
`;
  }

  return `
⚡ Workflow already completed.
`;
}

module.exports = {
  startBoost,
  continueBoost
};
