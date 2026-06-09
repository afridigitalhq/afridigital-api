let last = Date.now();

function heartbeat(){ last = Date.now(); }

function startWatchdog(){
  console.log("🧯 watchdog active");
  setInterval(()=>{
    if(Date.now() - last > 8000){
      console.log("⚠️ kernel idle detected");
      last = Date.now();
    }
  },3000);
}

module.exports = { heartbeat, startWatchdog };
