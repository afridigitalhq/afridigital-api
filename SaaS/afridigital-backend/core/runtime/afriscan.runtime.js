const { registerServer } = require("./registry/listener.registry");

function listen(fn) {
  console.log("🧠 AFRISCAN HOOK: intercepting listen()");
  return registerServer(fn);
}

module.exports = {
  listen
};
