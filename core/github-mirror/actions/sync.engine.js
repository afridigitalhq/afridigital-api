const { emit } = require("../../event-spine/ci.spine");

function syncToGitHub(pr) {
  const event = emit({
    type: "GITHUB_PR_SYNC",
    prId: pr.id,
    status: "SYNCED"
  });

  return {
    ok: true,
    githubPR: pr.id,
    event
  };
}

function triggerActions(prId) {
  const event = emit({
    type: "GITHUB_ACTIONS_TRIGGER",
    prId,
    status: "RUNNING"
  });

  return event;
}

module.exports = { syncToGitHub, triggerActions };
