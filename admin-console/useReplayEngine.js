import { useEffect, useRef, useState } from "react";

export default function useReplayEngine(trace) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  const events = trace?.events || [];

  const currentEvent = events[index] || null;

  useEffect(() => {
    if (!playing) return;

    intervalRef.current = setInterval(() => {
      setIndex((i) => {
        if (i >= events.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 800);

    return () => clearInterval(intervalRef.current);
  }, [playing, events.length]);

  const play = () => setPlaying(true);
  const pause = () => setPlaying(false);
  const reset = () => setIndex(0);
  const step = () => setIndex((i) => Math.min(i + 1, events.length - 1));

  return {
    index,
    playing,
    currentEvent,
    events,
    play,
    pause,
    reset,
    step
  };
}
