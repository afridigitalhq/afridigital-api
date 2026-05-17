import { useEffect, useState } from "react";

/**
 * A3.1 FRONTEND STREAM BINDER
 * connects UI dashboards to backend event bus
 */

export function useAfriStream(url) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("🟢 A3 STREAM CONNECTED");
    };

    ws.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data);
        setEvents((prev) => [event, ...prev].slice(0, 200));
      } catch (e) {}
    };

    ws.onerror = () => {
      console.log("🔴 STREAM ERROR");
    };

    return () => ws.close();
  }, [url]);

  return events;
}
