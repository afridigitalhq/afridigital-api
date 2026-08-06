import crypto from "node:crypto";

const Verifier={

sign(request,secret){

const signature=crypto
.createHmac("sha256",secret)
.update(JSON.stringify(request))
.digest("hex")
.toUpperCase();

return{
algorithm:"HMAC-SHA256",
signature:"HMAC-"+signature,
createdAt:Date.now(),
createdAtISO:new Date().toISOString()
};

},

verify(request,signature,secret){

const expected=crypto
.createHmac("sha256",secret)
.update(JSON.stringify(request))
.digest("hex")
.toUpperCase();

return{
verified:signature==="HMAC-"+expected,
algorithm:"HMAC-SHA256",
checkedAt:Date.now(),
checkedAtISO:new Date().toISOString()
};

},

health(){

return{
service:"AfriDebugAPIRequestSignatureVerifier",
algorithm:"HMAC-SHA256",
status:"healthy"
};

}

};

export default Verifier;
