const kernel = require("./core/kernel/bootstrap");
const attachA2 = require("./core/routes/a2.webhook");

// choose worker mode
const mode = process.env.A2_MODE || "single";

kernel.usePlugin("a2", attachA2);

if (mode === "distributed") {
  const worker = require("./core/workers/a2Worker.dist");
  worker.start();
} else {
  const worker = require("./core/workers/a2Worker");
  worker.start();
}

kernel.startServer(3000);
