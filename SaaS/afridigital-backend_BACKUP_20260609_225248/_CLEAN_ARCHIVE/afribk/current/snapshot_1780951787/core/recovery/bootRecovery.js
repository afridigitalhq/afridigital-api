const fs = require("fs");

function recover(){
  try{
    if(!fs.existsSync("logs/queue/eventQueue.json")){
      fs.mkdirSync("logs/queue",{recursive:true});
      fs.writeFileSync("logs/queue/eventQueue.json","[]");
    }

    if(!fs.existsSync("logs/afri-audit.log")){
      fs.writeFileSync("logs/afri-audit.log","");
    }

    console.log("♻️ recovery complete");
  }catch(e){
    console.log("recovery error",e.message);
  }
}

module.exports = { recover };
