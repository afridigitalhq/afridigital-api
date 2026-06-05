class DisabledRedis {
  constructor() {
    console.log("⚠️ Redis disabled (memory mode active)");
  }

  xread() { return null; }
  xreadgroup() { return null; }
  xadd() { return null; }
  publish() { return null; }
}

module.exports = DisabledRedis;
