const tracer = require("./tracer");

module.exports = {
  info(data) {
    console.log(JSON.stringify({ level: "info", ...data }));
  },

  error(data) {
    console.log(JSON.stringify({ level: "error", ...data }));
  },

  trace(event, step, meta = {}) {
    return tracer.trace(event, { step, meta });
  }
};
