const trace = require('./traceContext');
const runtime = require('./workflowRuntime');
const logger = require('../observability/logger');
module.exports = {
  async dispatch(event){
    const ctx = trace.create();
    logger.info({
      traceId: ctx.traceId,
      type: event.type,
      action: 'event_received'
    });
    const workflow = {
      name: 'defaultWorkflow',
      steps: [
        {
          agent: 'supportAgent',
          tool: 'send_message',
          payload: {
            text: event.text || 'runtime active'
          }
        }
      ]
    };
    return await runtime.execute(workflow,ctx);
  }
};
