export default function AfriBankGlobalObservabilityDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-6 grid gap-6">

      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-800">
          <h2 className="text-xl font-bold mb-2">
            🌍 Global Cluster Status
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Cluster Nodes</span>
              <span>12 ONLINE</span>
            </div>

            <div className="flex justify-between">
              <span>Replication Health</span>
              <span>98.99%</span>
            </div>

            <div className="flex justify-between">
              <span>Journal Throughput</span>
              <span>42K evt/sec</span>
            </div>

            <div className="flex justify-between">
              <span>Settlement Finality</span>
              <span>2.1s</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-800">
          <h2 className="text-xl font-bold mb-2">
            ⚡ Event Backbone
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Kafka Partitions</span>
              <span>24</span>
            </div>

            <div className="flex justify-between">
              <span>Replay Queue</span>
              <span>0 DELAY</span>
            </div>

            <div className="flex justify-between">
              <span>WebSocket Clients</span>
              <span>4,219</span>
            </div>

            <div className="flex justify-between">
              <span>Snapshot Engine</span>
              <span>HEALTHY</span>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
        <h2 className="text-2xl font-bold mb-4">
          ⏱ Time-Machine Replay
        </h2>

        <div className="space-y-3 text-sm">
          {[
            "ledger.credit → USR-482 → ₦50,000",
            "settlement.finalized → STL-99211",
            "fraud.alert → USR-771",
            "cluster.failover → LONDON-02",
            "snapshot.created → shard_AF_WEST"
          ].map((e, i) => (
            <div
              key={i}
              className="bg-zinc-800 rounded-xl p-3 font-mono"
            >
              {e}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
