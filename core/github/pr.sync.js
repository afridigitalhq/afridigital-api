const fetch = require("node-fetch");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO;

async function createGitHubPR({ title, body, branch }) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      head: branch,
      base: "main",
      body
    })
  });

  return res.json();
}

module.exports = { createGitHubPR };
