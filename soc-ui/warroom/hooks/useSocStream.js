import { useEffect, useState } from "react";

export default function useSocStream() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // placeholder for websocket binding
    console.log("📡 SOC stream hook ready");

    return () => {};
  }, []);

  return events;
}
