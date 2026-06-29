export class NodePhysicsEngine {
  constructor(nodes = []) {
    this.nodes = nodes;
  }

  step() {
    return this.nodes.map(n => {
      const repulsion = Math.random() * 2 - 1;
      const attraction = Math.random() * 1;

      return {
        ...n,
        x: (n.x || 0) + repulsion - attraction,
        y: (n.y || 0) + attraction - repulsion,
        stress: Math.random()
      };
    });
  }
}
