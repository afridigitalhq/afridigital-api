import React, { useEffect, useState } from "react";
import useSOCStream from "../hooks/useSOCStream";
import DAGCanvas from "../webgl/DAGCanvas";

export default function SOCCockpit() {
  const { events, forecast, health } = useSOCStream();
  const [glMode, setGlMode] = useState(true);

  return (
    <div className="w-full h-screen bg-black text-white flex overflow-hidden">
      
      {/* WebGL BACKGROUND LAYER */}
      {glMode && <DAGCanvas events={events} />}

      {/* SIDEBAR CONTROL PLANE */}
      <div className="w-64 bg-zinc-900/70 backdrop-blur-lg p-4 border-r border-zinc-800 z-10">
        <h1 className="text-lg font-bold">AfriDigital SOC</h1>
        <p className="text-xs text-gray-400">Unified Control Plane</p>

        <div className="mt-6 space-y-2 text-sm">
          <div>🧠 Kernel Health: {health?.kernel || "stable"}</div>
          <div>📡 WS Streams: {health?.ws || 0}</div>
          <div>📊 Events: {events?.length || 0}</div>
          <div>📈 Forecast: {forecast?.status || "active"}</div>
        </div>

        <button
          className="mt-6 px-3 py-2 bg-blue-600 rounded"
          onClick={() => setGlMode(!glMode)}
        >
          Toggle WebGL
        </button>
      </div>

      {/* MAIN DASHBOARD SURFACE */}
      <div className="flex-1 relative z-10 p-4">
        
        <div className="grid grid-cols-3 gap-4">
          
          {/* EVENT STREAM */}
          <div className="bg-black/40 border border-zinc-800 p-3 rounded">
            <h2 className="text-sm font-bold">Event Spine</h2>
            <pre className="text-xs h-64 overflow-auto">
              {JSON.stringify(events?.slice(-10), null, 2)}
            </pre>
          </div>

          {/* FORECAST PANEL */}
          <div className="bg-black/40 border border-zinc-800 p-3 rounded">
            <h2 className="text-sm font-bold">Forecast Engine</h2>
            <pre className="text-xs h-64 overflow-auto">
              {JSON.stringify(forecast, null, 2)}
            </pre>
          </div>

          {/* KERNEL STATE */}
          <div className="bg-black/40 border border-zinc-800 p-3 rounded">
            <h2 className="text-sm font-bold">Kernel State</h2>
            <pre className="text-xs h-64 overflow-auto">
              {JSON.stringify(health, null, 2)}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
}
import AfriDigitalWarRoom from '../warroom/AfriDigitalWarRoom';
