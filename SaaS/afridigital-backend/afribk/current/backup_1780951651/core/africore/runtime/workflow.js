const logger = require('../observability/logger');
const tools = require('./tools');

module.exports = {
  async execute(workflow, ctx){
    logger.info({ traceId: ctx.traceId, workflow: workflow.name, action: 'workflow_start' });

    const results = [];

    for(const step of workflow.steps){
      const result = await tools.execute(step.tool, step.payload, ctx);
      results.push(result);
    }

    logger.info({ traceId: ctx.traceId, workflow: workflow.name, action: 'workflow_complete' });

    return results;
  }
};
