const { tapSpine } = require("../taps/kernel/spine.tap");

function attachSpineTap(spine) {
  const originalEmit = spine.emit.bind(spine);

  spine.emit = function(event) {
    tapSpine(event); // mirror only
    return originalEmit(event);
  };

  return spine;
}

module.exports = { attachSpineTap };
