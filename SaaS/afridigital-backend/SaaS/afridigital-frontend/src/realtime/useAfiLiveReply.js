import { useEffect, useState } from "react";

/**
 * 💬 LIVE AI REPLY STREAM HOOK
 */

export function useAfiLiveReply(wsUrl) {

  const [thinking, setThinking] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [final, setFinal] = useState(null);

  useEffect(() => {

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (msg) => {
      const event = JSON.parse(msg.data);

      switch (event.type) {

        case "AI_THINKING":
          setThinking(event.payload);
          break;

        case "AI_STREAM_CHUNK":
          setChunks(prev => [...prev, event.payload.chunk]);
          break;

        case "AI_FINAL_RESPONSE":
          setFinal(event.payload);
          break;

        default:
          break;
      }
    };

    return () => ws.close();
  }, [wsUrl]);

  return { thinking, chunks, final };
}
