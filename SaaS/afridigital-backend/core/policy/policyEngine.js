const policies = {
  routingAgent: ['dispatch_event'],
  supportAgent: ['send_message'],
  commerceAgent: ['send_message','payment_lookup'],
  devopsAgent: ['system_read']
};
module.exports = {
  can(agent, action){
    return (policies[agent] || []).includes(action);
  }
};
