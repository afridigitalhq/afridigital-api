const UI_PATTERNS = [
  "┌","└","│","━",
  "AFRISCAN",
  "SYSTEM DEGRADED",
  "CONTROL",
  "STATUS",
  "🧠","📊","⚠️"
];

function detectUI(code = "") {
  return UI_PATTERNS.filter(p => code.includes(p));
}

module.exports = { detectUI };
