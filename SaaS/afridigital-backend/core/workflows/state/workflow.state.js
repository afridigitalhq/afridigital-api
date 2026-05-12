const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function setWorkflow(phone, workflow) {

  const workflows =
    db.read('workflow.db.json');

  let user =
    workflows.find(
      w => w.phone === phone
    );

  if (!user) {

    user = {
      phone,
      workflow: {}
    };

    workflows.push(user);
  }

  user.workflow = workflow;

  db.write(
    'workflow.db.json',
    workflows
  );

  return workflow;
}

function getWorkflow(phone) {

  const workflows =
    db.read('workflow.db.json');

  const user =
    workflows.find(
      w => w.phone === phone
    );

  if (!user) return null;

  return user.workflow;
}

function clearWorkflow(phone) {

  const workflows =
    db.read('workflow.db.json');

  const filtered =
    workflows.filter(
      w => w.phone !== phone
    );

  db.write(
    'workflow.db.json',
    filtered
  );
}

module.exports = {
  setWorkflow,
  getWorkflow,
  clearWorkflow
};
