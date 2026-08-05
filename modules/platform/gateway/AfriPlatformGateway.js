const AfriPlatformGateway = {
  services:{
    afriverified:"/api/afriverified",
    afritrust:"/api/afritrust",
    afritick:"/api/afritick",
    afridebug:"/api/afridebug",
  },

  resolve(service){
    return this.services[service] || null;
  }
};

export default AfriPlatformGateway;
