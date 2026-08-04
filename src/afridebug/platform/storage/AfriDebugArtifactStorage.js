import RuntimeStorage from "./AfriDebugRuntimeStorage.js";

const AfriDebugArtifactStorage = {

  save(type,id,data){

    return RuntimeStorage.write(
      `artifacts/${type}/${id}.json`,
      data
    );

  },


  get(type,id){

    return RuntimeStorage.read(
      `artifacts/${type}/${id}.json`,
      null
    );

  }

};

export default AfriDebugArtifactStorage;
