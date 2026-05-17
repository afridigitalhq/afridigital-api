const fs = require('fs');

function isValid(file) {
  const s = fs.readFileSync(file, 'utf8');

  if (s.length < 50) return false;
  if (!s.includes('module.exports')) return false;
  if ((s.match(/{/g) || []).length !== (s.match(/}/g) || []).length) return false;
  if (s.includes('undefined undefined')) return false;
  return true;
}

module.exports = { isValid };
