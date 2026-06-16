const fs = require('fs');
const contract = require('./architecture.contract');

function scanFile(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

module.exports = function enforce() {
  const violations = [];

  const uiPatterns = [
    "console.log",
    "┌", "└", "│", "━",
    "AFRISCAN CONTROL",
    "SYSTEM DEGRADED"
  ];

  contract.layers.core.forEach(file => {
    const content = scanFile(file);
    uiPatterns.forEach(p => {
      if (content.includes(p)) {
        violations.push(`${file}:UI_LEAK:${p}`);
      }
    });
  });

  return {
    ok: violations.length === 0,
    violations
  };
};
