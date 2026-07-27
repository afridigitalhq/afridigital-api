import membership from "./membership/index.js";
import subscriptions from "./subscriptions/index.js";
import billing from "./billing/index.js";
import payments from "./payments/index.js";
import benefits from "./benefits/index.js";
import notifications from "./notifications/index.js";

const AfriTickModule = {
  name: "AfriTick",
  version: "1.0.0",
  services: {
    membership,
    subscriptions,
    billing,
    payments,
    benefits,
    notifications
  }
};

export default AfriTickModule;
