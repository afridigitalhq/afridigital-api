import fs from "fs";
import path from "path";

const AfriBuildWorkspaceValidator={

 validate(workspace={}){

  const root=workspace.workspace;
  const type=workspace.type || "web_app";

  const required =
   type === "native-android"
    ? [
       "settings.gradle",
       "build.gradle",
       "gradle.properties",
       "app/build.gradle",
       "app/src/main/AndroidManifest.xml",
       "app/src/main/res/values/styles.xml",
       "app/src/main/java/com/afridigital/afritodo/MainActivity.kt"
      ]
    : [
       "package.json",
       "src/App.jsx",
       "src/main.jsx",
       "src/App.css"
      ];

  const checks={};

  required.forEach(file=>{
   checks[file]=fs.existsSync(
    path.join(root,file)
   );
  });

  const passed =
   Object.values(checks)
   .every(Boolean);

  return {
   workspace:root,
   type,
   checks,
   status:passed ? "VALIDATED":"FAILED",
   timestamp:new Date().toISOString()
  };

 }

};

export default AfriBuildWorkspaceValidator;
