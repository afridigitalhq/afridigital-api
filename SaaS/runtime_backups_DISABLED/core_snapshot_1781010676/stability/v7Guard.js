const MAX_QUEUE_DELAY = 400;
const MAX_BATCH_TIME = 50;

function sleep(ms){
  return new Promise(r => setTimeout(r, ms));
}

// prevents kernel freeze from long operations
function safeExecute(fn){
  return Promise.race([
    fn(),
    new Promise((_, reject)=>
      setTimeout(()=>reject(new Error("TIMEOUT")), 5000)
    )
  ]);
}

// throttles loop pressure
async function throttleQueue(queueSize){
  if(queueSize > 50){
    await sleep(MAX_QUEUE_DELAY);
  } else if(queueSize > 20){
    await sleep(100);
  }
}

// isolates execution failures
function isolateError(fn, fallback){
  try{
    return fn();
  }catch(e){
    console.log("⚠️ isolated error:", e.message);
    return fallback;
  }
}

module.exports = {
  sleep,
  safeExecute,
  throttleQueue,
  isolateError
};
