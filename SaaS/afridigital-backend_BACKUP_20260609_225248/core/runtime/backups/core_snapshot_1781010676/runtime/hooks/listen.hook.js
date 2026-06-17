const hookedListen = require("../core/runtime/hooks/listen.hook");
const fs = require("fs");
const path = require("path");
const { registerListener } = require("../registry/listeners.registry");

/**
 * Unified listener wrapper
 */
function hookedListen(server, port, sourceFile = "unknown") {

  registerListener({
    port,
    source: sourceFile
  });

  console.log("🪝 AFRISCAN HOOKED LISTENER →", port, "from", sourceFile);

  return server.listen .listen(.listen( hookedListen(port);
}

module.exports = hookedListen;
