import fs from "fs";
import path from "path";

const AfriBuildWorkspaceWriter={

 write(project={}){

  const root =
   path.join(
    "modules/afridesign/.generated",
    project.name || "afribuild-app"
   );

  fs.mkdirSync(root,{recursive:true});

  Object.entries(project.files || {}).forEach(
   ([file,content])=>{

    const target =
     path.join(root,file);

    fs.mkdirSync(
     path.dirname(target),
     {recursive:true}
    );

    fs.writeFileSync(
     target,
     content
    );

   }
  );

  return {
   workspace:root,
   files:Object.keys(project.files || {}),
   status:"WRITTEN"
  };

 }

};

export default AfriBuildWorkspaceWriter;
