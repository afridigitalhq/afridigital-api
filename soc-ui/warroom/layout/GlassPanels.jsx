import React from "react";

export default function GlassPanels() {
  return (
    <div className="absolute top-10 left-24 right-10 grid grid-cols-3 gap-4">

      <div className="backdrop-blur-xl bg-white/5 p-4 border border-white/10 rounded-xl">
        🔥 Threat Heat Field
      </div>

      <div className="backdrop-blur-xl bg-white/5 p-4 border border-white/10 rounded-xl">
        📊 Live Event Spine
      </div>

      <div className="backdrop-blur-xl bg-white/5 p-4 border border-white/10 rounded-xl">
        ⚡ System Load Forecast
      </div>

    </div>
  );
}
