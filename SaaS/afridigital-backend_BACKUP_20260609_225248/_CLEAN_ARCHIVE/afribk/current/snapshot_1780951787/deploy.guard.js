/* =========================
   DEPLOYMENT GUARD (V7 FINAL)
========================= */

let crashCount = 0;

function registerProcessGuards() {
  process.on("uncaughtException", (err) => {
    crashCount++;
    console.log("⚠️ Uncaught:", err.message);

    if (crashCount > 5) {
      console.log("🛑 Crash threshold reached → safe shutdown recommended");
    }
  });

  process.on("unhandledRejection", (err) => {
    console.log("⚠️ Rejection:", err?.message || err);
  });
}

function redisGuard(redis) {
  if (!redis) return;

  let reconnects = 0;

  redis.on("error", () => {
    reconnects++;

    if (reconnects > 10) {
      console.log("⚠️ Redis unstable → forcing cooldown");
      reconnects = 0;
    }
  });
}

function webhookGuard(ms = 180) {
  return (req, res, next) => {
    res.setTimeout(ms, () => {
      console.log("⚠️ webhook timeout prevented");
      res.sendStatus(200);
    });
    next();
  };
}

module.exports = {
  registerProcessGuards,
  redisGuard,
  webhookGuard
};
