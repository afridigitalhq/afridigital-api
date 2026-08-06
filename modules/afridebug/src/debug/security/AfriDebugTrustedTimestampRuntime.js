import crypto from "node:crypto";

const Runtime={

  stamp(data={}){

    const unix=Date.now();
    const iso=new Date(unix).toISOString();

    const payload=JSON.stringify({
      data,
      unix,
      iso
    });

    const token=crypto
      .createHash("sha256")
      .update(payload)
      .digest("hex")
      .toUpperCase();

    return{
      authority:"AfriDebug Trusted Timestamp Authority",
      algorithm:"SHA-256",
      unix,
      iso,
      token:"TSA-"+token
    };

  },

  verify(stamp,data={}){

    const payload=JSON.stringify({
      data,
      unix:stamp.unix,
      iso:stamp.iso
    });

    const expected="TSA-"+crypto
      .createHash("sha256")
      .update(payload)
      .digest("hex")
      .toUpperCase();

    return{
      verified:expected===stamp.token,
      authority:stamp.authority,
      checkedAt:Date.now(),
      checkedAtISO:new Date().toISOString()
    };

  },

  health(){

    return{
      service:"AfriDebugTrustedTimestampRuntime",
      authority:"AfriDebug Trusted Timestamp Authority",
      algorithm:"SHA-256",
      status:"healthy"
    };

  }

};

export default Runtime;
