export class AfriFixExecutionStateMachine {
  constructor() {
    this.states = [
      "CREATED",
      "PREVIEW",
      "APPROVAL",
      "QUEUED",
      "SCHEDULED",
      "EXECUTING",
      "VERIFYING",
      "EVIDENCE",
      "COMPLETED"
    ];
  }

  transition(state) {
    const index = this.states.indexOf(state);

    return {
      component: "AfriFix Execution State Machine",
      current: state,
      next: index >= 0 && index < this.states.length - 1
        ? this.states[index + 1]
        : null,
      completed: state === "COMPLETED",
      timestamp: new Date().toISOString()
    };
  }

  list() {
    return this.states;
  }
}
