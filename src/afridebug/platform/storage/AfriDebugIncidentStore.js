const incidents = [];

const AfriDebugIncidentStore = {

  save(input = {}) {

    const incident = {
      id:`INC-${Date.now()}`,
      ...input,
      createdAt:Date.now()
    };

    incidents.push(incident);

    return incident;

  },


  list(){

    return incidents;

  },


  find(id){

    return incidents.find(
      item => item.id === id
    ) || null;

  }

};

export default AfriDebugIncidentStore;
