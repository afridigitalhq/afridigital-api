const logger = require('../observability/logger');

module.exports = {
  async execute(tool, payload, ctx){
    logger.info({ traceId: ctx.traceId, tool, action: 'tool_execute' });

    if(tool === "send_message"){
      return {
        ok: true,
        payload
      };
    }

    throw new Error("UNKNOWN_TOOL");
  }
};
