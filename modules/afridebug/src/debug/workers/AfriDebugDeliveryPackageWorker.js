const packages = [];

const AfriDebugDeliveryPackageWorker = {

  execute(input = {}) {

    const pack = {

      id:`DELIVERY-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      investigationId:
        input.investigationId || null,

      clientId:
        input.clientId || null,

      reportId:
        input.reportId || null,

      contents:{
        technicalReport:true,
        verificationProof:true,
        snapshots:true,
        timeline:true,
        resolution:true
      },

      status:"READY_FOR_DELIVERY",

      createdAt:Date.now()
    };

    packages.push(pack);

    return pack;
  },


  stats(){

    return {
      packages:packages.length
    };
  }

};

export default AfriDebugDeliveryPackageWorker;
