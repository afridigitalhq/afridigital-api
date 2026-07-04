import { StressEngine } from "./stress/StressEngine";
import { FinanceFlowEngine } from "./finance/FinanceFlowEngine";
import { SecurityMapEngine } from "./security/SecurityMapEngine";
import { SwarmEngine } from "./swarm/SwarmEngine";

export class SimulationKernel {
  constructor(graph) {
    this.stress = new StressEngine(graph);
    this.finance = new FinanceFlowEngine();
    this.security = new SecurityMapEngine();
    this.swarm = new SwarmEngine(graph.nodes || []);
  }

  onEvent(event) {
    const id = event.type || event.nodeId;

    if (event.type === "FAILURE") this.stress.inject(id, 2);
    if (event.type === "TRANSACTION") this.finance.emitFlow(event.from, event.to, event.amount);
    if (event.type === "ATTACK") this.security.injectAttack(event.path);
  }

  tick() {
    return {
      stress: this.stress.propagate(),
      finance: this.finance.computeField(),
      security: this.security.trace(),
      swarm: this.swarm.tick()
    };
  }
}
