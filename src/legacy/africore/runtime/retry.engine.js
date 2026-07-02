async function withRetry(fn, retries = 3, delay = 300) {
  let lastErr;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn(i);
    } catch (e) {
      lastErr = e;
      await sleep(delay * (i + 1));
    }
  }

  throw lastErr;
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

module.exports = { withRetry };
