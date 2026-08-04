const STATES = Object.freeze({
  QUEUED:"QUEUED",
  RUNNING:"RUNNING",
  COMPLETED:"COMPLETED",
  FAILED:"FAILED",
  WAITING_APPROVAL:"WAITING_APPROVAL",
  DELIVERED:"DELIVERED"
});

const AfriDebugExecutionState = {
  all(){
    return Object.values(STATES);
  },
  isValid(state){
    return Object.values(STATES).includes(state);
  },
  initial(){
    return STATES.QUEUED;
  }
};

export default AfriDebugExecutionState;
