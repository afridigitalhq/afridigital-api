import fs from "fs";
import crypto from "crypto";
import path from "path";

const ignored=[
 "node_modules",
 ".git",
 "dist",
 "build",
 "coverage",
 ".cache"
];

const CoreDuplicateFinder={

 scan(files=[]){

  const hashes={};
  const duplicates=[];
  let emptyFilesIgnored=0;
  let ignoredFiles=0;

  files.forEach(file=>{

   if(ignored.some(x=>file.includes(path.sep+x+path.sep))){
    ignoredFiles++;
    return;
   }

   try{

    const stat=fs.statSync(file);

    if(stat.size===0){
     emptyFilesIgnored++;
     return;
    }

    const hash=crypto
      .createHash("sha256")
      .update(fs.readFileSync(file))
      .digest("hex");


    if(hashes[hash]){

     duplicates.push({
      original:hashes[hash],
      duplicate:file,
      hash
     });

    }else{

     hashes[hash]=file;

    }

   }catch{}

  });


  return {
   component:"Core Duplicate Finder",
   filesScanned:files.length,
   duplicates,
   duplicateCount:duplicates.length,
   emptyFilesIgnored,
   ignoredFiles,
   status:"SCANNED",
   scannedAt:new Date().toISOString()
  };

 }

};

export default CoreDuplicateFinder;
