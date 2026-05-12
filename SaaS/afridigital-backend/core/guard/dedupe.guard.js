const { assertApiVersion } = require("../runtime/safety/api.guard");
const cache = new Set();

exports.check = (id) => {
  if (!id) return false;
  if (cache.has(id)) return false;

  cache.add(id);

  // soft memory cleanup
  if (cache.size > 5000) {
    cache.clear();
  }

  return true;
};
