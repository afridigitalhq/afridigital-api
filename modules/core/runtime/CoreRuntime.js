import CoreServiceRegistry from "../registry/CoreServiceRegistry.js";

const CoreRuntime={boot(){return {name:"AfriDigital Core",status:"RUNNING",services:CoreServiceRegistry.services};}};

export default CoreRuntime;
