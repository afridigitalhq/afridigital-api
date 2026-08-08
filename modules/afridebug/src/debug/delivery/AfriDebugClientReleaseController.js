const AfriDebugClientReleaseController = {

  release(input = {}){

    const approved =
      input.reviewApproved === true &&
      input.deliveryReady === true;

    return {

      releaseId:
        "RELEASE-" + Date.now(),

      packageId:
        input.packageId || null,

      reviewId:
        input.reviewId || null,

      certificationId:
        input.certificationId || null,

      status:
        approved
          ? "CLIENT_RELEASE_COMPLETED"
          : "CLIENT_RELEASE_BLOCKED",

      released:
        approved,

      approvalContext:{
        required:true,
        reviewStatus:
          input.reviewApproved
            ? "approved"
            : "pending",
        executionMode:
          "AFRINUCCHAIN_APPROVAL"
      },

      lifecycle:
        approved
          ? "COMPLETED"
          : "WAITING_APPROVAL",

      createdAt:
        Date.now()

    };

  },

  health(){

    return {
      service:"AfriDebugClientReleaseController",
      status:"healthy"
    };

  }

};

export default AfriDebugClientReleaseController;
