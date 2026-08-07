/**
 * AfriDesign Workspace Duplication Audit
 *
 * Purpose:
 * Finds duplicate workspace systems.
 *
 * Rule:
 * Inspection only.
 */

import fs from "fs";


console.log(
"\n=== AFRIDESIGN WORKSPACE DUPLICATION AUDIT ===\n"
);


const paths = [

 "src/platform/workspace",

 "src/ecosystem/workspace",

 "src/dashboard/partials",

 "src/runtime",

 "src/platform/shell"

];


paths.forEach(path=>{


 if(fs.existsSync(path)){

   console.log(
   "FOUND:",
   path
   );


   const files =
   fs.readdirSync(path);


   files.forEach(file=>{

     if(
       file.toLowerCase().includes("workspace") ||
       file.toLowerCase().includes("router") ||
       file.toLowerCase().includes("session")
     ){

       console.log(
       "  →",
       file
       );

     }

   });


 } else {

   console.log(
   "MISSING:",
   path
   );

 }


 console.log(
 "\n-------------------------\n"
 );


});


console.log(
"=== WORKSPACE AUDIT COMPLETE ==="
);

