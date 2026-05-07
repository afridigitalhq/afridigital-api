const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "../../");
const FRONTEND = path.join(ROOT, "SaaS/afridigital-frontend");
const BACKEND = path.join(ROOT, "SaaS/afridigital-backend");

function run(cmd, cwd){
  execSync(cmd, { stdio: "inherit", cwd });
}

function validate(){
  if(!fs.existsSync(path.join(FRONTEND,"package.json"))){
    throw new Error("Frontend missing package.json");
  }
  if(!fs.existsSync(path.join(BACKEND,"server.js"))){
    throw new Error("Backend missing server.js");
  }
}

function build(){
  console.log("\n[V7] BUILD LAYER RUNNING...");
  run("npm install && npm run build", FRONTEND);
}

function post(){
  console.log("\n[V7] ENFORCE UI...");
  run("node enforce-ui.cjs", FRONTEND);
}

module.exports = {
  run: function(){
    validate();
    build();
    post();
  }
};
