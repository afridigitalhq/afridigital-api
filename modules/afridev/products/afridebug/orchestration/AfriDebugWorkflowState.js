const AfriDebugWorkflowState={
  current:"INITIALIZED",

  update(state){
    this.current=state;
    return this.current;
  }
};

export default AfriDebugWorkflowState;
