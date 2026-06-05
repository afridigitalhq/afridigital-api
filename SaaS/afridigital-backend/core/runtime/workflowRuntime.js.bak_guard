const logger = require('../observability/logger');
const toolGateway = require('./toolGateway');
module.exports = {
  async execute(workflow,context){
    logger.info({
      traceId: context.traceId,
      workflow: workflow.name,
      action: 'workflow_start'
    });
    const results = [];
    for(const step of workflow.steps){
      const result = await toolGateway.execute(
        step.agent,
        step.tool,
        step.payload,
        context.traceId
      );
      results.push(result);
    }
    logger.info({
      traceId: context.traceId,
      workflow: workflow.name,
      action: 'workflow_complete'
    });
    return results;
  }
};
