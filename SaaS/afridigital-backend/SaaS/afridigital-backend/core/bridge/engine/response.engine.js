const { assertApiVersion } = require("../runtime/safety/api.guard");
const { resolveIntent } = require('./intent.bridge');

async function generateResponse(message) {

  const intent =
    await resolveIntent(message);

  switch(intent.type) {

    case 'SYSTEM_STATUS':
      return `
🧠 SYSTEM STATUS

${JSON.stringify(intent.data, null, 2)}
`;

    case 'CONTROL_STATUS':
      return `
🎛 CONTROL STATUS

${JSON.stringify(intent.data, null, 2)}
`;

    case 'DASHBOARD':
      return `
📊 DASHBOARD REQUEST RECEIVED
(Use /api/dashboard for full data)
`;

    default:
      return `
🤖 AfriAI Active

Send:
- system
- control
- dashboard
`;
  }
}

module.exports = { generateResponse };
