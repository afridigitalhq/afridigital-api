const AfriDebugHumanReviewGate = {

  review(input = {}){

    const approved =
      input.deliveryReady === true &&
      input.reviewerDecision === "approved";

    return {

      reviewId:
        "REVIEW-" + Date.now(),

      packageId:
        input.packageId || null,

      reviewer:
        input.reviewer || null,

      decision:
        input.reviewerDecision || "pending",

      status:
        approved
          ? "APPROVED_FOR_RELEASE"
          : "RELEASE_BLOCKED",

      approved,

      approvalContext:{
        required:true,
        reviewer:
          input.reviewer || null,
        decision:
          input.reviewerDecision || "pending",
        executionMode:
          "AFRINUCCHAIN_APPROVAL"
      },

      createdAt:
        Date.now()

    };

  },

  health(){

    return {
      service:"AfriDebugHumanReviewGate",
      status:"healthy"
    };

  }

};

export default AfriDebugHumanReviewGate;
