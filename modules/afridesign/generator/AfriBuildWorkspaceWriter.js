import fs from "fs";
import path from "path";

const AfriBuildWorkspaceWriter={

 write(project={}){

  const generatedRoot = path.resolve("modules/afridesign/.generated");
  const root = path.join(generatedRoot, project.name || "afribuild-app");

  if (root.startsWith(generatedRoot + path.sep) === false) throw new Error("INVALID_WORKSPACE_ROOT");
  fs.rmSync(root,{recursive:true,force:true});
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
