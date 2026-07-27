const AfriAIProviderRegistry = {

  providers:{},

  register(name,provider){
    this.providers[name] = provider;
  },

  get(name){
    return this.providers[name];
  },

  list(){
    return Object.keys(this.providers);
  }

};

export default AfriAIProviderRegistry;
