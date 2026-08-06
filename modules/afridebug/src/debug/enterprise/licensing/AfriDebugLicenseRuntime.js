const licenses=[];

const AfriDebugLicenseRuntime={

  issue(input={}){

    const license={

      id:`LICENSE-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      organizationId:input.organizationId||null,

      tier:input.tier||"Enterprise",

      status:"VALID",

      issuedAt:Date.now()

    };

    licenses.push(license);

    return license;

  },

  list(){ return licenses; },

  stats(){ return { licenses:licenses.length }; }

};

export default AfriDebugLicenseRuntime;
