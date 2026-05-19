function route(text = '') {
  const t = text.toLowerCase();

  if (t.includes('pay') || t.includes('wallet') || t.includes('transfer')) {
    return 'FINANCE';
  }

  if (t.length < 20) {
    return 'FAST';
  }

  return 'ANALYTICS';
}

module.exports = { route };
