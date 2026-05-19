const { assertApiVersion } = require("../runtime/safety/api.guard");
const api = require('../services/api.client');

async function resolveIntent(message) {

  const text = message.toLowerCase();

  const system =
    await api.getSystem();

  const control =
    await api.getControl();

  if (text.includes('system')) {
    return {
      type: 'SYSTEM_STATUS',
      data: system
    };
  }

  if (text.includes('control')) {
    return {
      type: 'CONTROL_STATUS',
      data: control
    };
  }

  if (text.includes('dashboard')) {
    return {
      type: 'DASHBOARD'
    };
  }

  return {
    type: 'DEFAULT'
  };
}

module.exports = { resolveIntent };
