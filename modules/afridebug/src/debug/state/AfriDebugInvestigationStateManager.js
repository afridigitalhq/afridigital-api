import Storage from "../storage/AfriDebugStorage.js";

const AfriDebugInvestigationStateManager = {

  create(input = {}) {

    const data = Storage.get();

    const record = {

      id: input.investigationId || `INV-${Date.now()}`,

      status:"CREATED",

      history:[
        {
          state:"CREATED",
          timestamp:Date.now()
        }
      ],

      createdAt:Date.now()
    };

    data.states.push(record);

    Storage.update(data);

    return record;
  },


  update(id,status){

    const data = Storage.get();

    const record = data.states.find(
      x=>x.id===id
    );

    if(!record){
      return {
        success:false,
        reason:"INVESTIGATION_NOT_FOUND"
      };
    }

    record.status=status;

    record.history.push({
      state:status,
      timestamp:Date.now()
    });

    Storage.update(data);

    return {
      success:true,
      record
    };
  },


  get(id){

    const data = Storage.get();

    return data.states.find(
      x=>x.id===id
    );
  },


  list(){

    return Storage.get().states;

  },


  stats(){

    return {
      investigations:
        Storage.get().states.length
    };
  }

};

export default AfriDebugInvestigationStateManager;
