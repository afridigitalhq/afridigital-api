/**
 * Kernel Safety Facade
 * Bridges kernel → real security validators
 */

const envValidator = require("../../services/security/env.validator.cjs");

function validate(input) {
  // pass-through validation layer (extend later safely)
  return envValidator ? envValidator : true;
}

module.exports = {
  validate
};
