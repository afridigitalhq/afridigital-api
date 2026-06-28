const fetch = require("node-fetch");

async function triggerRenderDeploy() {
  if (!process.env.RENDER_DEPLOY_HOOK) {
    throw new Error("Missing Render deploy hook");
  }

  return fetch(process.env.RENDER_DEPLOY_HOOK, {
    method: "POST"
  });
}

module.exports = { triggerRenderDeploy };
