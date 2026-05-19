const gate=require('../permissions/gate');function enforce(input){const check=gate.guard(input);if(!check.allowed)return '⛔ Access denied (admin only)';return null;}module.exports={enforce};
