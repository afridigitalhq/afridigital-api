const { assertApiVersion } = require("../runtime/safety/api.guard");
const { getDashboard } = require('../../dashboard/dashboard.engine');
const { getFlags, toggleFeature } = require('../../api/services/control.service');

async function executeAdminCommand(text) {

  const cmd =
    text.toLowerCase();

  if (cmd === 'dashboard') {
    return getDashboard();
  }

  if (cmd === 'flags') {
    return JSON.stringify(
      getFlags(),
      null,
      2
    );
  }

  if (cmd === 'ads off') {

    toggleFeature('ads', false);

    return '📢 Ads Disabled';
  }

  if (cmd === 'ads on') {

    toggleFeature('ads', true);

    return '📢 Ads Enabled';
  }

  return '⚠ Unknown Admin Command';
}

module.exports = {
  executeAdminCommand
};
