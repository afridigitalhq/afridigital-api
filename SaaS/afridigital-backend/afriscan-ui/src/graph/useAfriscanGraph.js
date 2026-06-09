import { useEffect, useState } from "react";
import { AfriscanWS } from "./wsClient";

const client = new AfriscanWS("ws://localhost:9090");

export function useAfriscanGraph() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    client.connect();

    const unsub = client.subscribe((node, all) => {
      setNodes([...all]);
    });

    return () => unsub();
  }, []);

  return nodes;
}
