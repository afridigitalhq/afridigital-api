const revoked=new Map();

const CRL={

revoke({certificateId,reason="unspecified",revokedBy="AfriDebugAdmin"}){
const record={
certificateId,
reason,
revokedBy,
revokedAt:Date.now(),
revokedAtISO:new Date().toISOString()
};
revoked.set(certificateId,record);
return record;
},

isRevoked(certificateId){
const record=revoked.get(certificateId);
return{
revoked:!!record,
record:record||null
};
},

list(){
return [...revoked.values()];
},

stats(){
return{revokedCertificates:revoked.size};
},

health(){
return{
service:"AfriDebugCertificateRevocationList",
algorithm:"RSA-SHA256",
status:"healthy"
};
}

};

export default CRL;
