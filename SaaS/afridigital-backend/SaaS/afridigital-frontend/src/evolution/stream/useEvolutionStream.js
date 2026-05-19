import { useEffect, useState } from "react";

/**
 * ⚡ REAL-TIME EVOLUTION STREAM HOOK
 */

export function useEvolutionStream(url) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.channel === "EVOLUTION_STREAM") {
        setEvents((prev) => [data.payload, ...prev].slice(0, 100));
      }
    };

    return () => ws.close();
  }, [url]);

  return events;
}
