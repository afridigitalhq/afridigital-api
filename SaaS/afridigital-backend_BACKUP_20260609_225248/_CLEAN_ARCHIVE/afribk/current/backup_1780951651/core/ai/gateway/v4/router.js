const registry = require('./registry');
const circuit = require('./circuit');

const order = ["ollama", "mock", "openai"];

function select(auto = true, preferred) {
  if (!auto && preferred) return preferred;

  const candidates = order.filter(circuit.isOpen);

  if (candidates.length === 0) return "mock";

  return candidates.sort((a,b)=>
    registry.score(b) - registry.score(a)
  )[0];
}

module.exports = { select };
