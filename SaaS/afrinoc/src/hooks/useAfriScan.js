import { useEffect, useState } from "react";

export default function useAfriScan() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5051");

    ws.onmessage = (msg) => {
      setData(JSON.parse(msg.data));
    };

    ws.onerror = () => {
      setData(null);
    };

    return () => ws.close();
  }, []);

  return data;
}
