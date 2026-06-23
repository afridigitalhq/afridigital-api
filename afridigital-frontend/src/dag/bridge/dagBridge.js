// 🎥 DAG STATE BRIDGE (VISUAL ENGINE HOOK)

let dagState = [];

export function updateDAGState(event) {
  dagState.push(event);

  // keep memory bounded
  if (dagState.length > 100) dagState.shift();
}

export function getDAGState() {
  return dagState;
}
