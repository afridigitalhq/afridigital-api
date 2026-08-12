const plans = {

  free:{
    id:"free",
    name:"AfriAI Free",
    status:"ACTIVE",

    capabilities:[
      "chat.basic",
      "knowledge.basic"
    ],

    limits:{
      aiRequests:"ADMIN_CONFIGURED",
      advancedReasoning:false,
      productAssistants:0,
      businessKnowledge:false,
      apiAccess:false,
      whatsappAgent:false,
      automation:false,
      analytics:false,
      plugins:false,
      customIntegrations:false,
      customUsageLimits:false
    }
  },

  starter:{
    id:"starter",
    name:"AfriAI Starter",
    status:"ACTIVE",

    capabilities:[
      "chat.basic",
      "knowledge.basic",
      "reasoning.advanced",
      "product.assistant"
    ],

    limits:{
      aiRequests:"ADMIN_CONFIGURED",
      advancedReasoning:true,
      productAssistants:3,
      businessKnowledge:false,
      apiAccess:false,
      whatsappAgent:true,
      automation:true,
      analytics:false,
      plugins:false,
      customIntegrations:false,
      customUsageLimits:false
    }
  },

  pro:{
    id:"pro",
    name:"AfriAI Pro",
    status:"ACTIVE",

    capabilities:[
      "chat.basic",
      "knowledge.basic",
      "reasoning.advanced",
      "product.assistant",
      "business.knowledge",
      "api.access",
      "whatsapp.agent",
      "automation",
      "analytics"
    ],

    limits:{
      aiRequests:"ADMIN_CONFIGURED",
      advancedReasoning:true,
      productAssistants:10,
      businessKnowledge:true,
      apiAccess:true,
      whatsappAgent:true,
      automation:true,
      analytics:true,
      plugins:false,
      customIntegrations:false,
      customUsageLimits:false
    }
  },

  enterprise:{
    id:"enterprise",
    name:"AfriAI Enterprise",
    status:"ACTIVE",

    capabilities:[
      "*"
    ],

    limits:{
      aiRequests:"CUSTOM",
      advancedReasoning:true,
      productAssistants:"CUSTOM",
      businessKnowledge:true,
      apiAccess:true,
      whatsappAgent:true,
      automation:true,
      analytics:true,
      plugins:true,
      customIntegrations:true,
      customUsageLimits:true
    }
  }

};

const AfriAIPlanEntitlementRegistry = {

  get(planId="free"){
    return plans[planId] || null;
  },

  list(){
    return Object.values(plans);
  },

  has(planId="free", capability=""){
    const plan = this.get(planId);

    if(!plan){
      return false;
    }

    return (
      plan.capabilities.includes("*") ||
      plan.capabilities.includes(capability)
    );
  }

};

export default AfriAIPlanEntitlementRegistry;
