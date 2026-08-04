import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const ROOT=path.resolve(
  __dirname,
  "../../../../.afridebug-runtime"
);

const AfriDebugRuntimeStorage = {

  read(file, fallback){

    const target=path.join(ROOT,file);

    if(!fs.existsSync(target)){
      return fallback;
    }

    return JSON.parse(
      fs.readFileSync(target,"utf8")
    );

  },


  write(file,data){

    const target=path.join(ROOT,file);

    fs.mkdirSync(
      path.dirname(target),
      {recursive:true}
    );

    fs.writeFileSync(
      target,
      JSON.stringify(data,null,2)
    );

    return data;

  }

};

export default AfriDebugRuntimeStorage;
