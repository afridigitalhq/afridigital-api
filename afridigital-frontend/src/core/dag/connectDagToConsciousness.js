import { consciousnessBus } from "../consciousness/ConsciousEventBus";

export function connectDag(dagEngine) {
  if (!dagEngine) return;

  dagEngine.subscribe?.((state) => {
    consciousnessBus.emit({
      type: "DAG_UPDATE",
      payload: state
    });
  });
}
