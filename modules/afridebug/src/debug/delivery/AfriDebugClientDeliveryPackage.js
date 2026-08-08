const AfriDebugClientDeliveryPackage = {

  generate(input = {}){

    const ready =
      input.certified === true &&
      input.verificationPassed === true &&
      input.regressionPassed === true;

    return {

      packageId:
        "PACKAGE-" + Date.now(),

      certificationId:
        input.certificationId || null,

      verificationId:
        input.verificationId || null,

      regressionId:
        input.regressionId || null,

      status:
        ready
          ? "DELIVERY_PACKAGE_READY"
          : "DELIVERY_PACKAGE_BLOCKED",

      deliveryReady:
        ready,

      approvalContext:
        input.approvalContext || null,

      evidenceIncluded:[
        "Verification Evidence",
        "Regression Evidence",
        "Certification Evidence"
      ],

      createdAt:
        Date.now()

    };

  },

  health(){

    return {
      service:"AfriDebugClientDeliveryPackage",
      status:"healthy"
    };

  }

};

export default AfriDebugClientDeliveryPackage;
