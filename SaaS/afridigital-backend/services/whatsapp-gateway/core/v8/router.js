function route(text = '') {

  const t = text.toLowerCase();

  if (t.includes('pay') || t.includes('wallet')) {
    return { lane: 'FINANCE' };
  }

  if (t.length < 20) {
    return { lane: 'FAST' };
  }

  return { lane: 'ANALYTICS' };
}

module.exports = { route };
