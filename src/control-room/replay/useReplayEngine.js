import { useState } from "react";
import { SOCReplayEngine } from "./SOCReplayEngine";

export function useReplayEngine(stream) {
  const [engine] = useState(() => new SOCReplayEngine(stream));
  const [state, setState] = useState(engine.getState());

  const rewind = (n = 10) => setState(engine.rewind(n));
  const forward = (n = 10) => setState(engine.forward(n));
  const jump = (t) => setState(engine.jumpTo(t));

  return { state, rewind, forward, jump };
}
