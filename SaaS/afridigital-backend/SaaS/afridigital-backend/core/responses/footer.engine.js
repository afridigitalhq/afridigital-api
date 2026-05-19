const { assertApiVersion } = require("../runtime/safety/api.guard");
const platforms = require('../../config/platforms');

function injectFooter(message) {
return `
${message}

━━━━━━━━━━━━━━━
🤖 AfriAI Ecosystem
🌍 ${platforms.web}
`;
}

module.exports = { injectFooter };
