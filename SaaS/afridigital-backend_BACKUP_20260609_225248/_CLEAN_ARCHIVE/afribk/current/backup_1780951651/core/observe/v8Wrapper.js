const { trace, error } = require("./v8Observe");

function wrapRun(runCommand, sendWhatsAppMessage){
  return async (ctx, sender) => {
    try {
      trace({ type: "event", payload: ctx });
      return await runCommand(ctx, sender);
    } catch (e) {
      error(e);
      throw e;
    }
  };
}

module.exports = { wrapRun };
