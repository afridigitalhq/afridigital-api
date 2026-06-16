function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

/**
 * Execute with retry policy
 */
async function executeWithRetry(fn, node, context = {}, policy = {}) {
  const retries = policy.retries ?? 1;
  const delay = policy.delay ?? 0;

  let lastError;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn(node, context);
    } catch (err) {
      lastError = err;
      if (delay) await sleep(delay);
    }
  }

  return {
    node,
    status: "FAILED",
    error: lastError.message
  };
}

module.exports = {
  executeWithRetry
};
