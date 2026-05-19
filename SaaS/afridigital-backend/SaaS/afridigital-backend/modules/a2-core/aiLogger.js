const fs = require("fs");

function logAI(event) {
  try {
    const log = {
      time: new Date().toISOString(),
      channel: event.channel,
      from: event.from,
      input: event.input,
      output: event.output,
      mode: event.mode
    };

    fs.appendFileSync(
      "./ai-runtime.log",
      JSON.stringify(log) + "\n"
    );
  } catch (e) {
    // fail silently (never break AI flow)
  }
}

module.exports = logAI;
