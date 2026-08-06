import Queue from "../approval/AfriDebugRepairApprovalQueue.js";
import Bridge from "../integration/execution/AfriDebugRepairExecutionBridge.js";

const AfriDebugExecutionGate = {

  execute(input={}){

    const approval =
      Queue.list()
      .find(
        item =>
        item.approvalId === input.approvalId
      );


    if(!approval || approval.status !== "approved"){

      return {

        status:"blocked",

        reason:"APPROVAL_REQUIRED"

      };

    }


    const execution =
      Bridge.execute(input);


    return {

      status:"executed",

      approval,

      execution

    };

  },


  health(){

    return {

      service:"AfriDebugExecutionGate",

      status:"healthy"

    };

  }

};


export default AfriDebugExecutionGate;
