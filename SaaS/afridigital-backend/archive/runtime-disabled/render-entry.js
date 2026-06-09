const hookedListen = require("../core/runtime/hooks/listen.hook");
const express = require("express");
const { enforceSingleRuntime } = require("./core/kernel/single-runtime-guard");

const app = express();
const PORT = process.env.PORT || 10000;

// enforce runtime safety
enforceSingleRuntime(app);

// routes only (safe import layer)
require("./app/app")(app);

app.listen .listen(.listen( hookedListen(PORT, "0.0.0.0", () => {
  console.log("🚀 SINGLE RUNTIME ACTIVE ON PORT", PORT);
});
