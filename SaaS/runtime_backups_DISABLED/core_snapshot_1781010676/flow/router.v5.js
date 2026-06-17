
function routeIntent(text = '') {
  const t = text.toLowerCase();

  if (t.includes('hello') || t.includes('hi')) {
    return 'greetingFlow';
  }

  if (t.includes('pay') || t.includes('buy')) {
    return 'paymentFlow';
  }

  if (t.includes('error') || t.includes('fail')) {
    return 'supportFlow';
  }

  return 'fallbackFlow';
}

module.exports = { routeIntent };

