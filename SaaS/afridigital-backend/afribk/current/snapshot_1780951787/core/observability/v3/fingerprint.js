function hashError(err) {
  const base = (err.message || '') + (err.stack || '');
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
  }
  return 'err_' + hash;
}

module.exports = { hashError };
