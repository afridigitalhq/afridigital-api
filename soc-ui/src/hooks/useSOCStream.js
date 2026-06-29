import { useEffect, useState } from "react";

export default function useSOCStream() {
  const [events, setEvents] = useState([]);
  const [forecast, setForecast] = useState({});
  const [health, setHealth] = useState({ kernel: "ok", ws: 0 });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "EVENT") {
        setEvents((prev) => [...prev, data.payload]);
      }

      if (data.type === "FORECAST") {
        setForecast(data.payload);
      }

      if (data.type === "HEALTH") {
        setHealth(data.payload);
      }
    };

    return () => ws.close();
  }, []);

  return { events, forecast, health };
}
