const { createGitHubPR } = require("../github-mirror/pr.mirror");

async function sendToCI(pr) {
  const gh = await createGitHubPR(pr);

  return {
    status: "CI_SENT",
    github: gh,
    ciProvider: "github-actions"
  };
}

module.exports = { sendToCI };
