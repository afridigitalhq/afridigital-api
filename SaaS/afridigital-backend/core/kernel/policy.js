const { domains } = require("./registry");

function allowed(from, to) {
  const allowed = domains[from] || [];
  return allowed.includes(to);
}

module.exports = { allowed };
