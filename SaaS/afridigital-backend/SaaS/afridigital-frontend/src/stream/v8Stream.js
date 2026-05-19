import { useEffect, useState } from "react";
import { STREAM_URL } from "../config/stream";

/**
 * A3.2 V8 STREAM BINDING ENGINE
 * - auto connects to AfriAI event bus
 * - supports plug-and-play dashboards
 */

export function useV8Stream() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(STREAM_URL);

    ws.onopen = () => {
      console.log("🟢 A3 STREAM CONNECTED:", STREAM_URL);
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        setEvents((prev) => [data, ...prev].slice(0, 150));
      } catch (e) {}
    };

    ws.onerror = () => {
      console.log("🔴 STREAM ERROR");
    };

    return () => ws.close();
  }, []);

  return events;
}
