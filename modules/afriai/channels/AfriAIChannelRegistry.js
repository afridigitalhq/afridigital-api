const AfriAIChannelRegistry = {

  channels:[
    "AfriWhatsApp",
    "Web",
    "Mobile",
    "Admin",
    "InternalOperations"
  ],

  load(){
    return this.channels;
  }

};

export default AfriAIChannelRegistry;
