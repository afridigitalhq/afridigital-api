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
    this.currentState = "CREATED";
    this.history = ["CREATED"];
  }

  transition(state) {
    const index = this.states.indexOf(state);

    if (index < 0) {
      return {
        component: "AfriFix Execution State Machine",
        status: "REJECTED",
        current: this.currentState,
        requested: state,
        reason: "INVALID_STATE",
        timestamp: new Date().toISOString()
      };
    }

    const currentIndex = this.states.indexOf(this.currentState);

    if (index !== currentIndex + 1 && state !== this.currentState) {
      return {
        component: "AfriFix Execution State Machine",
        status: "REJECTED",
        current: this.currentState,
        requested: state,
        reason: "INVALID_TRANSITION",
        timestamp: new Date().toISOString()
      };
    }

    this.currentState = state;

    if (this.history[this.history.length - 1] !== state) {
      this.history.push(state);
    }

    return {
      component: "AfriFix Execution State Machine",
      status: "TRANSITIONED",
      current: this.currentState,
      next: index < this.states.length - 1 ? this.states[index + 1] : null,
      completed: state === "COMPLETED",
      history: [...this.history],
      timestamp: new Date().toISOString()
    };
  }

  list() {
    return [...this.history];
  }

  allStates() {
    return [...this.states];
  }

  current() {
    return this.currentState;
  }
}
