import fs from "fs";
import path from "path";

const CoreRepositoryMapper={
 scan(repository={}){

  const root=repository.path || process.cwd();

  const files=[];
  const directories=[];

  function walk(current){

   if(!fs.existsSync(current)) return;

   fs.readdirSync(current,{withFileTypes:true}).forEach(entry=>{

    const full=path.join(current,entry.name);

    if(entry.isDirectory()){
      directories.push(full);
      walk(full);
    }

    if(entry.isFile()){
      files.push(full);
    }

   });

  }

  walk(root);

  return {
    repository,
    root,
    files,
    directories,
    fileCount:files.length,
    directoryCount:directories.length,
    status:"MAPPED",
    scannedAt:new Date().toISOString()
  };

 }

};

export default CoreRepositoryMapper;
