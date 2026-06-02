import { useState } from "react";
import { resolvePath } from "./pathResolver";

/**
 * Handles node click → trace extraction → replay state
 */
export function useNodeNavigation(graph) {
  const [activePath, setActivePath] = useState([]);
  const [replayIndex, setReplayIndex] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);

  function onNodeClick(nodeId) {
    const path = resolvePath(graph, nodeId);
    setActivePath(path);
    setReplayIndex(0);
  }

  function startReplay() {
    setIsReplaying(true);

    let i = 0;
    const interval = setInterval(() => {
      i++;

      setReplayIndex(i);

      if (i >= activePath.length) {
        clearInterval(interval);
        setIsReplaying(false);
      }
    }, 700);
  }

  function resetReplay() {
    setActivePath([]);
    setReplayIndex(0);
    setIsReplaying(false);
  }

  return {
    activePath,
    replayIndex,
    isReplaying,
    onNodeClick,
    startReplay,
    resetReplay
  };
}
