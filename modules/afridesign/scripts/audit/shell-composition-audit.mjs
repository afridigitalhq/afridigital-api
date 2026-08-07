/**
 * AfriDesign Shell Composition Audit
 *
 * Purpose:
 * Validates shell ownership paths.
 *
 * Rule:
 * Inspection only.
 */

import fs from "fs";


console.log(
"\n=== AFRIDESIGN SHELL COMPOSITION AUDIT ===\n"
);


const owners = [

 "src/platform/shell/header",

 "src/platform/toolbar",

 "src/platform/shell/sidebar",

 "src/platform/workspace",

 "src/platform/properties",

 "src/platform/dock"

];


owners.forEach(path=>{


 if(fs.existsSync(path)){

   console.log(
   "✓ CONNECTED:",
   path
   );

 } else {

   console.log(
   "✕ MISSING:",
   path
   );

 }

});


console.log(
"\n=== SHELL AUDIT COMPLETE ==="
);

