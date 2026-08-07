/**
 * AfriDesign Workspace Removal Safety Audit
 *
 * Purpose:
 * Finds dependencies on legacy workspace files.
 *
 * Rule:
 * Inspection only.
 */

import fs from "fs";
import path from "path";


const targets = [

 "src/ecosystem/workspace",

 "src/dashboard/partials/Workspace.jsx"

];


const scanRoot = "src";


console.log(
"\n=== WORKSPACE REMOVAL SAFETY AUDIT ===\n"
);


function scan(dir){

 let results = [];

 if(!fs.existsSync(dir)){
   return results;
 }

 fs.readdirSync(dir).forEach(file=>{

   const full =
   path.join(dir,file);

   const stat =
   fs.statSync(full);


   if(stat.isDirectory()){

     results =
     results.concat(scan(full));

   }
   else if(
     full.endsWith(".js") ||
     full.endsWith(".jsx")
   ){

     results.push(full);

   }

 });


 return results;

}


const files = scan(scanRoot);


targets.forEach(target=>{


 console.log(
 "\nTARGET:",
 target
 );


 const matches =
 files.filter(file=>{

   const content =
   fs.readFileSync(
    file,
    "utf8"
   );


   return content.includes(target);

 });


 if(matches.length){

   console.log(
   "⚠ REFERENCES FOUND:"
   );

   matches.forEach(match=>
     console.log(
       "  →",
       match
     )
   );

 }
 else{

   console.log(
   "✓ NO REFERENCES"
   );

 }


});


console.log(
"\n=== SAFETY AUDIT COMPLETE ==="
);

