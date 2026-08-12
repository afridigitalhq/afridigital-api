import fs from "fs";
import path from "path";

const AfriBuildWorkspaceValidator={

 validate(workspace={}){

  const root=workspace.workspace;

  const required=[
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
   checks,
   status:passed ? "VALIDATED":"FAILED",
   timestamp:new Date().toISOString()
  };

 }

};

export default AfriBuildWorkspaceValidator;
