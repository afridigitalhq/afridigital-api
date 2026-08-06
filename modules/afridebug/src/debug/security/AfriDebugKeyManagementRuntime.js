import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const KEY_DIR=".afridebug/keys";
const PRIVATE_KEY=path.join(KEY_DIR,"afridebug-private.pem");
const PUBLIC_KEY=path.join(KEY_DIR,"afridebug-public.pem");

if(!fs.existsSync(KEY_DIR)){
  fs.mkdirSync(KEY_DIR,{recursive:true});
}

if(!fs.existsSync(PRIVATE_KEY)||!fs.existsSync(PUBLIC_KEY)){

  const {privateKey,publicKey}=crypto.generateKeyPairSync("rsa",{
    modulusLength:4096,
    publicKeyEncoding:{type:"spki",format:"pem"},
    privateKeyEncoding:{type:"pkcs8",format:"pem"}
  });

  fs.writeFileSync(PRIVATE_KEY,privateKey,{mode:0o600});
  fs.writeFileSync(PUBLIC_KEY,publicKey);

}

const privateKey=fs.readFileSync(PRIVATE_KEY,"utf8");
const publicKey=fs.readFileSync(PUBLIC_KEY,"utf8");

const fingerprint="SHA256:"+crypto
.createHash("sha256")
.update(publicKey)
.digest("hex")
.toUpperCase();

const AfriDebugKeyManagementRuntime={

  privateKey(){
    return privateKey;
  },

  publicKey(){
    return publicKey;
  },

  fingerprint(){
    return fingerprint;
  },

  health(){
    return{
      service:"AfriDebugKeyManagementRuntime",
      algorithm:"RSA-4096",
      fingerprint,
      keyDirectory:KEY_DIR,
      persistent:true,
      status:"healthy"
    };
  }

};

export default AfriDebugKeyManagementRuntime;
