const subscriptions = [];

const plans = {
  FREE:{
    credits:10,
    features:["basic-debug"]
  },

  DEVELOPER:{
    credits:100,
    features:[
      "repository-import",
      "ai-analysis",
      "patch-planning"
    ]
  },

  PRO:{
    credits:500,
    features:[
      "advanced-ai",
      "verification",
      "reports"
    ]
  },

  ENTERPRISE:{
    credits:5000,
    features:[
      "team-access",
      "admin-monitoring",
      "api-access"
    ]
  }
};


const AfriDebugSubscriptionRuntime = {

  subscribe(user, plan="FREE") {

    const subscription = {
      id:`SUB-${Date.now()}`,
      user,
      plan,
      credits:plans[plan].credits,
      features:plans[plan].features,
      status:"ACTIVE",
      createdAt:Date.now()
    };

    subscriptions.push(subscription);

    return subscription;
  },


  list() {
    return subscriptions;
  },


  plans() {
    return plans;
  }

};


export default AfriDebugSubscriptionRuntime;
