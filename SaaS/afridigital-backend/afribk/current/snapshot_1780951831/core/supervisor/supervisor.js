let lastBeat = Date.now();

function beat(){ lastBeat = Date.now(); }

function startSupervisor(){
  console.log("🧠 V8 SUPERVISOR ACTIVE");

  setInterval(()=>{
    const diff = Date.now() - lastBeat;

    if(diff > 10000){
      console.log("⚠️ supervisor: kernel stall detected");
    }
  }, 3000);
}

module.exports = { beat, startSupervisor };
