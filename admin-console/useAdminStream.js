import { useEffect, useState } from "react";

export default function useAdminStream() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const source = new EventSource("/realtime/admin");

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setEvents((prev) => [data, ...prev].slice(0, 50));
      } catch (e) {
        console.log("Stream parse error", e);
      }
    };

    source.onerror = () => {
      console.log("Admin stream disconnected");
    };

    return () => source.close();
  }, []);

  return events;
}
