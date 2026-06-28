const fetch = require("node-fetch");

async function createGitHubPR(payload) {
  return {
    status: "SYNCED",
    source: "whatsapp",
    payload
  };
}

module.exports = { createGitHubPR };
