export class EnrollmentWizard {
  start(device) {
    return {
      step: "START",
      device,
      status: "IN_PROGRESS"
    };
  }

  complete(device) {
    return {
      step: "COMPLETE",
      device,
      status: "ENROLLED"
    };
  }
}
