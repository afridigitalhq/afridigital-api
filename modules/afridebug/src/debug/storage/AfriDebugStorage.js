import fs from "fs";
import path from "path";

const FILE =
  path.resolve(
    "src/core/afriai/debug/storage/afridebug-state.json"
  );


function load(){

  if(!fs.existsSync(FILE)){
    return {
      states:[],
      events:[]
    };
  }

  return JSON.parse(
    fs.readFileSync(FILE,"utf8")
  );
}


function save(data){

  fs.writeFileSync(
    FILE,
    JSON.stringify(data,null,2)
  );

}


const AfriDebugStorage = {

  get(){

    return load();

  },


  update(data){

    save(data);

    return true;

  }

};


export default AfriDebugStorage;
