export class SOCAttackSim {
  simulate(chain) {
    return chain.map((step, i) => ({
      step,
      risk: Math.random(),
      index: i
    }));
  }
}
