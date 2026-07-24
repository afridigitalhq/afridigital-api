/**
 * Unified Router Aggregator
 * Single kernel-facing routing surface
 */

const afriai = require("../ai/afriai.router");
const command = require("../afriai/command.router");
const ui = require("../ui/router/router.engine");
const whatsapp = require("../whatsapp-ci/router");

module.exports = {
  afriai,
  command,
  ui,
  whatsapp
};
