const { createDeployPR } = require("./pr.engine");
const { getUser } = require("./users");

/**
 * WhatsApp → ALWAYS creates PR
 * No direct deployment allowed here
 */
async function handleWhatsAppDeploy(message, whatsappId) {
  const user = getUser(whatsappId);

  const pr = await createDeployPR({
    whatsappId,
    message
  });

  return {
    status: "PR_CREATED",
    prId: pr.id,
    role: user.role,
    ci: pr.ci
  };
}

module.exports = { handleWhatsAppDeploy };
