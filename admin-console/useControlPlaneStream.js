import { useEffect, useState } from "react";

export default function useControlPlaneStream() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const es = new EventSource("/realtime/admin");

    es.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);

        setEvents((prev) => {
          const updated = [data, ...prev];
          return updated.slice(0, 200); // keep memory safe
        });
      } catch (e) {}
    };

    return () => es.close();
  }, []);

  return events;
}
