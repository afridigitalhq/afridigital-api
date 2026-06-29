import { useEffect, useState } from "react";

export default function useSOCStream() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (msg) => {
      setEvents(prev => [...prev, JSON.parse(msg.data)]);
    };

    return () => ws.close();
  }, []);

  return events;
}
