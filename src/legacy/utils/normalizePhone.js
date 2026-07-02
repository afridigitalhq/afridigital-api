function normalizePhone(num) {
  if (!num) return num;

  if (num.startsWith("+")) return num;

  if (num.startsWith("234")) return "+" + num;

  if (num.startsWith("0")) return "+234" + num.slice(1);

  return num;
}

module.exports = { normalizePhone };
