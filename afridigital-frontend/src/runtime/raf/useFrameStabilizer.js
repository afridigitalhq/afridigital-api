import { useEffect, useRef, useState } from "react";

/**
 * rAF stabilized state buffer
 * - absorbs high-frequency WS updates
 * - emits at 60fps max
 */
export function useFrameStabilizer(socket) {
  const buffer = useRef(null);
  const frame = useRef(null);
  const [state, setState] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (msg) => {
      try {
        buffer.current = JSON.parse(msg.data);

        if (!frame.current) {
          frame.current = requestAnimationFrame(() => {
            setState(buffer.current);
            frame.current = null;
          });
        }
      } catch (e) {}
    };

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [socket]);

  return state;
}
