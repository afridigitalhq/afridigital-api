import crypto from "node:crypto";

const Guard={

verify(payload,signature){

const hash=crypto
.createHash("sha256")
.update(JSON.stringify(payload))
.digest("hex")
.toUpperCase();

const expected="SHA256-"+hash;

return{
 verified:signature===expected,
 payloadHash:expected,
 checkedAt:Date.now(),
 checkedAtISO:new Date().toISOString()
};

},

inspect(event){

return{
 channel:"AfriWhatsApp",
 sender:event.sender||"unknown",
 messageId:event.messageId||null,
 risk:event.messageId?"low":"medium",
 inspectedAt:Date.now(),
 inspectedAtISO:new Date().toISOString()
};

},

health(){

return{
 service:"AfriDebugWhatsAppWebhookSecurityGuard",
 algorithm:"SHA-256",
 status:"healthy"
};

}

};

export default Guard;
