import { consciousnessBus } from "../consciousness/ConsciousEventBus";

export function bindDagToConsciousness(dagEngine) {
  dagEngine.onUpdate = (state) => {
    consciousnessBus.emit({
      type: "DAG_UPDATE",
      payload: state,
      timestamp: Date.now()
    });
  };
}
