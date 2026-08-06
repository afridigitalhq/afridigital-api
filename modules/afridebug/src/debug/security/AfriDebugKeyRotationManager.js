const Rotation={

rotate(currentKey){

const newKey={
 oldKeyId:currentKey.keyId,
 newKeyId:"AFRIDBG-KEY-"+Date.now(),
 rotatedAt:Date.now(),
 rotatedAtISO:new Date().toISOString(),
 status:"rotated"
};

return newKey;

},

health(){

return{
 service:"AfriDebugKeyRotationManager",
 status:"healthy"
};

}

};

export default Rotation;
