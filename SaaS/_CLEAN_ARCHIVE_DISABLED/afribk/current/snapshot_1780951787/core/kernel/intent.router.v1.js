function routeIntent(text = '') {
  const t = text.toLowerCase();

  if (t.includes('hello')) return 'greetingFlow';
  if (t.includes('__force_fail__')) return 'systemFlow';

  return 'fallbackFlow';
}

module.exports = { routeIntent };
