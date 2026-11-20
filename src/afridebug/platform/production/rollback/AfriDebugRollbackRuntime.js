const rollbacks=[];

const AfriDebugRollbackRuntime={

  rollback(input={}){

    const record={

      rollbackId:`ROLLBACK-${Date.now()}`,

      incidentId:input.incidentId || null,

      patchId:input.patchId || null,

      version:input.version || null,

      reason:input.reason || "unspecified",

      approvedBy:input.approvedBy || null,

      approvalStatus:
        input.approvalStatus || "pending",

      status: "not_executed",

      rolledBackAt: null

    };

    rollbacks.push(record);

    return record;

  },


  approve(rollbackId, approvedBy="system"){

    const rollback=
      rollbacks.find(r=>r.rollbackId===rollbackId);

    if(!rollback){

      return {
        success:false,
        reason:"ROLLBACK_NOT_FOUND"
      };

    }


    rollback.approvalStatus="approved";

    rollback.approvedBy=approvedBy;

    rollback.status="not_executed";

    rollback.rolledBackAt=null;


    return {
      success:true,
      rollback
    };

  },


  list(){

    return rollbacks;

  },


  stats(){

    return {
      rollbacks:rollbacks.length
    };

  }

};


export default AfriDebugRollbackRuntime;
