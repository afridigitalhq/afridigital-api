import { hybridController } from "./HybridModeController";

class HybridStressController {
  constructor() {
    this.metrics = {
      cpu: 0,
      gpu: 0,
      latency: 0,
      wsFailures: 0
    };
  }

  update(metrics) {
    this.metrics = { ...this.metrics, ...metrics };
    this.evaluate();
  }

  evaluate() {
    const { cpu, gpu, latency, wsFailures } = this.metrics;

    const stress =
      (cpu * 0.3) +
      (gpu * 0.4) +
      (latency * 0.2) +
      (wsFailures * 10);

    if (stress > 80) {
      hybridController.setMode("fallback");
    } else if (stress > 50) {
      hybridController.setMode("hybrid");
    } else {
      hybridController.setMode("hybrid");
    }
  }
}

export const stressController = new HybridStressController();
