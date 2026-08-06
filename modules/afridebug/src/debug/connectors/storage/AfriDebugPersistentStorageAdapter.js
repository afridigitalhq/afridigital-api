import fs from "fs";
import path from "path";

const FILE =
  path.resolve(".afridebug/state.json");

const emptyState = {
  connectors:[],
  events:[]
};

function load(){

  if(!fs.existsSync(FILE)){

    fs.writeFileSync(
      FILE,
      JSON.stringify(emptyState,null,2)
    );

  }

  return JSON.parse(
    fs.readFileSync(FILE,"utf8")
  );

}

function save(state){

  fs.writeFileSync(
    FILE,
    JSON.stringify(state,null,2)
  );

}

const AfriDebugPersistentStorageAdapter = {

  saveConnector(connector){

    const state = load();

    state.connectors.push(connector);

    save(state);

    return connector;

  },


  saveEvent(event){

    const state = load();

    state.events.push(event);

    save(state);

    return event;

  },


  get(){

    return load();

  },


  stats(){

    const state = load();

    return {

      connectors:state.connectors.length,

      events:state.events.length

    };

  },


  health(){

    return {

      service:"AfriDebugPersistentStorageAdapter",

      status:"healthy"

    };

  }

};

export default AfriDebugPersistentStorageAdapter;
