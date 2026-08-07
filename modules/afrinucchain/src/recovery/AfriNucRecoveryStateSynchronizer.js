export class AfriNucRecoveryStateSynchronizer {

  constructor(){
    this.component = "AfriNuc Recovery State Synchronizer";
  }

  sync({workspaceId,jobId,status="DELIVERY_READY"}){

    return {
      component:this.component,
      status:"SYNCHRONIZED",
      workspaceId,
      jobId,
      state:{
        jobStatus:status,
        workspaceStatus:"ACTIVE",
        deliveryStatus:"READY"
      },
      audit:{
        event:"RECOVERY_STATE_SYNCHRONIZED"
      },
      synchronizedAt:new Date().toISOString()
    };
  }
}
