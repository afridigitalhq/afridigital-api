import PackageBuilder from "../production/packaging/AfriDebugPackageBuilder.js";
import ArtifactStorage from "../storage/AfriDebugArtifactStorage.js";

const AfriDebugDeliveryPackageWorker = {

  execute(input = {}) {

    const pkg =
      PackageBuilder.build();


    const delivery = {

      id:`DELIVERY-PACKAGE-${Date.now()}`,

      investigationId:
        input.investigationId || null,

      clientId:
        input.clientId || null,

      reportId:
        input.reportId || null,

      package:pkg,

      status:"READY",

      createdAt:Date.now()

    };


    ArtifactStorage.save(
      "deliveries",
      delivery.id,
      delivery
    );


    return delivery;

  }

};

export default AfriDebugDeliveryPackageWorker;
