const { assertApiVersion } = require("../runtime/safety/api.guard");
function renderHealth(data) {
  return `
🟢 BACKEND: ${data.backend}
🟢 WHATSAPP: ${data.whatsapp}
🟢 DATABASE: ${data.database}

🧠 MEMORY: ${Math.round(data.memory / 1024 / 1024)} MB
⏱ UPTIME: ${Math.round(data.uptime)} sec
`;
}

module.exports = { renderHealth };
