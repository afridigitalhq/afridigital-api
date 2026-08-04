import RuntimeStorage from "../storage/AfriDebugRuntimeStorage.js";

const FILE="state/investigations.json";

const AfriDebugInvestigationStateManager = {

  load(){

    return RuntimeStorage.read(
      FILE,
      {}
    );

  },


  save(states){

    return RuntimeStorage.write(
      FILE,
      states
    );

  },


  create(input = {}){

    const states=this.load();

    const id=input.investigationId;

    states[id]={
      investigationId:id,
      status:"CREATED",
      updatedAt:Date.now()
    };

    this.save(states);

    return states[id];

  },


  update(id,status){

    const states=this.load();

    if(!states[id]){

      return {
        success:false,
        reason:"INVESTIGATION_NOT_FOUND"
      };

    }

    states[id].status=status;
    states[id].updatedAt=Date.now();

    this.save(states);

    return states[id];

  },


  get(id){

    const states=this.load();

    return states[id] || null;

  }

};

export default AfriDebugInvestigationStateManager;
