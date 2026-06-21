import { useMemo } from "react";
import { propagate } from "./attackPropagation";
import { usePhysicsStream } from "../physics/usePhysicsStream";

export function usePropagationField(wsUrl, edges = []) {
  const nodes = usePhysicsStream(wsUrl);

  const field = useMemo(() => {
    return propagate(nodes || [], edges);
  }, [nodes, edges]);

  return field;
}
