const { emit } = require("../unified/event.bus");

function renderLog(level, message) {
  emit({
    type: "render_ci_log",
    payload: { level, message }
  });
}

module.exports = { renderLog };
