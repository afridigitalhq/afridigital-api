function normalizePhone(num) {
  let n = String(num).replace(/\s/g, '');

  if (n.startsWith('+')) n = n.slice(1);

  if (n.startsWith('0')) {
    n = '234' + n.slice(1);
  }

  return '+' + n;
}

module.exports = { normalizePhone };
