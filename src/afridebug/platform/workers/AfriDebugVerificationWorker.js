const AfriDebugVerificationWorker = {

  execute(input = {}) {

    return {

      investigationId:
        input.investigationId || null,

      patchId:
        input.patchId || null,

      tests:[],
      status:"UNVERIFIED",
      reason:"TEST_EXECUTION_NOT_IMPLEMENTED",

      verifiedAt:null

    };

  }

};

export default AfriDebugVerificationWorker;
