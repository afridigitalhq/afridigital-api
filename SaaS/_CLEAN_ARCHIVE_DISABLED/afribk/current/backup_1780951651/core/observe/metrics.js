let heartbeat = Date.now();
let processed = 0;
let failed = 0;

function tick(){
  heartbeat = Date.now();
  processed++;
}

function fail(){
  failed++;
}

function snapshot(){
  return {
    heartbeat,
    processed,
    failed,
    uptime: Date.now()
  };
}

module.exports = { tick, fail, snapshot };
