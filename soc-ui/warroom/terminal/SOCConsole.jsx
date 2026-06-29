import React from "react";

export default function SOCConsole() {
  return (
    <div className="absolute bottom-6 left-24 right-24 bg-black/70 border border-green-500 text-green-400 p-3 font-mono text-xs rounded-lg">
      $ SOC LIVE TERMINAL READY  
      $ stream: connected  
      $ events: listening  
      $ forecast: active  
    </div>
  );
}
