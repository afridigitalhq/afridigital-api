import { useEffect, useState } from "react";

export default function useTraceStream() {
  const [traceEvents, setTraceEvents] = useState([]);
  const [status, setStatus] = useState("disconnected");

  useEffect(() => {
    const es = new EventSource("https://afridigital-api.onrender.com/trace");
    setStatus("connected");

    es.onmessage = (e) => {
      setTraceEvents(prev => [...prev.slice(-200), JSON.parse(e.data)]);
    };

    es.onerror = () => setStatus("reconnecting");

    return () => es.close();
  }, []);

  return { traceEvents, status };
}
