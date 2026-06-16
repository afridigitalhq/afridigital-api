function isolate(domain, fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      throw new Error(`V18.3_ISOLATION_BREACH: ${domain} → ${e.message}`);
    }
  };
}

module.exports = { isolate };
