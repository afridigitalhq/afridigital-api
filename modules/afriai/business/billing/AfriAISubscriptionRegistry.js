const AfriAISubscriptionRegistry = {

  subscriptions: [

    {
      id:"free",
      name:"AfriAI Free",
      status:"ACTIVE",
      limits:{
        apiRequests:100,
        whatsappConversations:50,
        assistants:1
      },
      features:[
        "AfriAI Assistant",
        "Web Access"
      ]
    },

    {
      id:"business_starter",
      name:"AfriAI Business Starter",
      status:"ACTIVE",
      limits:{
        apiRequests:5000,
        whatsappConversations:2000,
        assistants:3
      },
      features:[
        "AfriAI Assistant",
        "WhatsApp Agent",
        "Lead Capture"
      ]
    },

    {
      id:"business_pro",
      name:"AfriAI Business Pro",
      status:"ACTIVE",
      limits:{
        apiRequests:50000,
        whatsappConversations:20000,
        assistants:10
      },
      features:[
        "WhatsApp Agent",
        "API Access",
        "Business Knowledge",
        "Analytics"
      ]
    },

    {
      id:"enterprise",
      name:"AfriAI Enterprise API",
      status:"ACTIVE",
      limits:{
        apiRequests:"unlimited",
        whatsappConversations:"custom",
        assistants:"custom"
      },
      features:[
        "Full API Access",
        "Plugins",
        "Custom Integrations",
        "Priority Support"
      ]
    }

  ],


  get(subscriptionId){

    return this.subscriptions.find(
      item => item.id === subscriptionId
    );

  },


  list(){

    return this.subscriptions;

  }

};


export default AfriAISubscriptionRegistry;
