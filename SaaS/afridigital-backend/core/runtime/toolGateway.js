const logger = require('../observability/logger');
const policy = require('../policy/policyEngine');
const tools = {
  send_message: async(payload)=>({ ok:true, payload }),
  payment_lookup: async(payload)=>({ ok:true, payload }),
  system_read: async()=>({ ok:true })
};
module.exports = {
  async execute(agent,tool,payload,traceId){
    if(!policy.can(agent,tool)){
      throw new Error('POLICY_DENIED');
    }
    if(!tools[tool]){
      throw new Error('UNKNOWN_TOOL');
    }
    logger.info({ traceId, agent, tool, action:'tool_execute' });
    return await tools[tool](payload);
  }
};
