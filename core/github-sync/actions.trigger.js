const fetch = require("node-fetch");

const ACTIONS_URL = process.env.GH_ACTIONS_HOOK;

async function triggerActions(pr) {
  if (!ACTIONS_URL) return;

  await fetch(ACTIONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "WHATSAPP_PR_CREATED",
      pr
    })
  });
}

module.exports = { triggerActions };
