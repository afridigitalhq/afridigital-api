import crypto from "node:crypto";
import Keys from "./AfriDebugKeyManagementRuntime.js";

const KEY_ID="AFRIDBG-KEY-001";
const VERSION="1.0";
const ENVIRONMENT=process.env.NODE_ENV||"development";
const SIGNED_BY="AfriDebugRuntime";

const privateKey=Keys.privateKey();
const publicKey=Keys.publicKey();
const keyFingerprint=Keys.fingerprint();

const now=()=>({
  unix:Date.now(),
  iso:new Date().toISOString()
});

const AfriDebugDigitalSignatureRuntime={

  sign(data={}){

    const t=now();

    const signature=crypto.sign(
      "sha256",
      Buffer.from(JSON.stringify(data)),
      privateKey
    ).toString("base64");

    return{
      algorithm:"RSA-SHA256",
      keyId:KEY_ID,
      keyFingerprint,
      signedBy:SIGNED_BY,
      environment:ENVIRONMENT,
      version:VERSION,
      signature,
      signedAt:t.unix,
      signedAtISO:t.iso
    };

  },

  verify(data={},signature){

    const t=now();

    return{
      verified:crypto.verify(
        "sha256",
        Buffer.from(JSON.stringify(data)),
        publicKey,
        Buffer.from(signature,"base64")
      ),
      algorithm:"RSA-SHA256",
      keyId:KEY_ID,
      keyFingerprint,
      verifiedBy:"AfriDebugVerifier",
      checkedAt:t.unix,
      checkedAtISO:t.iso
    };

  },

  publicKey(){
    return publicKey;
  },

  health(){

    return{
      service:"AfriDebugDigitalSignatureRuntime",
      algorithm:"RSA-SHA256",
      keyId:KEY_ID,
      keyFingerprint,
      environment:ENVIRONMENT,
      version:VERSION,
      persistentKeys:true,
      status:"healthy"
    };

  }

};

export default AfriDebugDigitalSignatureRuntime;
