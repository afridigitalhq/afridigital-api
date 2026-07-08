import fs from "fs";
import path from "path";

export function discoverProducts(registry){
  const base=path.resolve("src");
  const dirs=fs.readdirSync(base,{withFileTypes:true})
    .filter(d=>d.isDirectory())
    .map(d=>d.name);

  for(const dir of dirs){
    const p=path.join(base,dir,"bootstrap/index.js");
    if(fs.existsSync(p)){
      import(p).then(mod=>{
        if(mod.init){
          registry.register(dir,mod.init);
        }
      }).catch(()=>{});
    }
  }
}
