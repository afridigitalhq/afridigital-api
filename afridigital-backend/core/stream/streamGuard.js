const { emitStrict } = require("./dagContract");

function attachStreamGuard(io) {
  return {
    emit(event) {
      emitStrict(io, event);
    }
  };
}

module.exports = { attachStreamGuard };
