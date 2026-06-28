const fetch = require("node-fetch");

const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function createGitHubPR(pr) {
  if (!GITHUB_REPO || !GITHUB_TOKEN) return null;

  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: `[WHATSAPP PR] ${pr.id}`,
      head: `whatsapp-${pr.id}`,
      base: "main",
      body: pr.message
    })
  });

  return res.json();
}

module.exports = { createGitHubPR };
