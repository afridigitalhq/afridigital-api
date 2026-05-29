function withTimeout(promise, ms = 8000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve({ ok: false, error: "timeout" });
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        resolve({ ok: false, error: err.message });
      });
  });
}

module.exports = { withTimeout };
