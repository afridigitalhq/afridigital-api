/**
 * AfriDesign Architecture Audit Script
 *
 * Purpose:
 * Reports architecture ownership.
 *
 * Rule:
 * Inspection only.
 */

import fs from "fs";


const registryPath =
"./src/platform/audit/ArchitectureAuditRegistry.js";


console.log(
"\n=== AFRIDESIGN ARCHITECTURE OWNERSHIP AUDIT ===\n"
);


if(!fs.existsSync(registryPath)){

 console.log(
 "Audit registry missing"
 );

 process.exit(1);

}


const content =
fs.readFileSync(
 registryPath,
 "utf8"
);


const systems = [
 "canvas",
 "preview",
 "workspace",
 "editor",
 "graphics"
];


systems.forEach(system=>{


 console.log(
 `SYSTEM: ${system}`
 );


 const index =
 content.indexOf(
 `system:"${system}"`
 );


 if(index === -1){

   console.log(
   "  Status: NOT REGISTERED\n"
   );

   return;

 }


 const block =
 content.substring(
 index,
 index + 250
 );


 console.log(
 block
 );


 console.log(
 "\n-------------------------\n"
 );


});


console.log(
"=== AUDIT COMPLETE ==="
);

