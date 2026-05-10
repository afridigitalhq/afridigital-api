const seen = new Set();

exports.check = (id) => {
  if (seen.has(id)) return false;
  seen.add(id);

  // memory limit safety
  if (seen.size > 10000) {
    seen.clear();
  }

  return true;
};
