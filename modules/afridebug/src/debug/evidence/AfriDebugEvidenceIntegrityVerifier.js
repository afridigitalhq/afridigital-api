import crypto from "node:crypto";

const sha256=(value)=>
  crypto
    .createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex")
    .toUpperCase();

const AfriDebugEvidenceIntegrityVerifier={

  verify(evidence={}){

    const copy=structuredClone(evidence);

    const original=copy.integrityHash;

    delete copy.integrityHash;

    const calculated="SHA256-"+sha256(copy);

    return{

      verified:original===calculated,

      algorithm:"SHA-256",

      originalHash:original,

      calculatedHash:calculated,

      checkedAt:Date.now()

    };

  },

  generate(evidence={}){

    const copy=structuredClone(evidence);

    delete copy.integrityHash;

    return{

      algorithm:"SHA-256",

      integrityHash:"SHA256-"+sha256(copy)

    };

  },

  health(){

    return{

      service:"AfriDebugEvidenceIntegrityVerifier",

      algorithm:"SHA-256",

      status:"healthy"

    };

  }

};

export default AfriDebugEvidenceIntegrityVerifier;
