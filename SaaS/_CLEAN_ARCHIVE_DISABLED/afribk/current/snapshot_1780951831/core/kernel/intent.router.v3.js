function routeIntent(text = '') {
  const t = text.toLowerCase();

  const rules = [
    { match: ['hello', 'hi', 'hey'], flow: 'greetingFlow' },
    { match: ['__force_fail__'], flow: 'systemFlow' },
    { match: ['error', 'fail'], flow: 'systemFlow' }
  ];

  for (const r of rules) {
    if (r.match.some(m => t.includes(m))) return r.flow;
  }

  return 'unknownFlow';
}

module.exports = { routeIntent };
