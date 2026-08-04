const signers=new Map();

const TrustStore={

add(signer){
const record={
...signer,
addedAt:Date.now(),
addedAtISO:new Date().toISOString(),
status:"trusted"
};
signers.set(record.keyId,record);
return record;
},

get(keyId){
return signers.get(keyId)||null;
},

isTrusted(keyId){
const signer=signers.get(keyId);
return{
trusted:!!signer,
signer:signer||null
};
},

list(){
return [...signers.values()];
},

stats(){
return{trustedSigners:signers.size};
},

health(){
return{
service:"AfriDebugTrustStore",
algorithm:"RSA-SHA256",
status:"healthy"
};
}

};

export default TrustStore;
