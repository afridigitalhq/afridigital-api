function start() {
  console.log("🧠 Workers initializing...");

  setImmediate(() => {
    console.log("🧠 Background worker ready");
  });
}

module.exports = { start };
