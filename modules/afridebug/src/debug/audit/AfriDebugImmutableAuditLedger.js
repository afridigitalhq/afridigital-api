import crypto from "node:crypto";

const chain=[];

function hash(entry){
  return "SHA256-"+crypto.createHash("sha256").update(JSON.stringify(entry)).digest("hex").toUpperCase();
}

const Ledger={

  record(event={}){

    const previousHash=chain.length?chain[chain.length-1].hash:"GENESIS";

    const payload={
      ledgerId:"LEDGER-"+Date.now()+"-"+Math.random().toString(36).slice(2,8),
      previousHash,
      timestamp:Date.now(),
      timestampISO:new Date().toISOString(),
      event
    };

    const currentHash=hash(payload);

    const record={
      ...payload,
      hash:currentHash
    };

    chain.push(record);

    return record;

  },

  verify(){

    for(let i=0;i<chain.length;i++){

      const current=chain[i];

      const expected=i===0?"GENESIS":chain[i-1].hash;

      if(current.previousHash!==expected){

        return{
          verified:false,
          index:i,
          reason:"broken_chain"
        };

      }

      const calculated=hash({
        ledgerId:current.ledgerId,
        previousHash:current.previousHash,
        timestamp:current.timestamp,
        timestampISO:current.timestampISO,
        event:current.event
      });

      if(calculated!==current.hash){

        return{
          verified:false,
          index:i,
          reason:"hash_mismatch"
        };

      }

    }

    return{
      verified:true,
      records:chain.length,
      checkedAt:Date.now(),
      checkedAtISO:new Date().toISOString()
    };

  },

  history(){
    return chain;
  },

  stats(){
    return{
      records:chain.length
    };
  },

  health(){
    return{
      service:"AfriDebugImmutableAuditLedger",
      algorithm:"SHA-256",
      immutable:true,
      status:"healthy"
    };
  }

};

export default Ledger;
