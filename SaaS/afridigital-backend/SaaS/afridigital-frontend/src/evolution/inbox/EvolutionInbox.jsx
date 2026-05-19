import React, { useEffect, useState } from "react";
import { fetchProposals, approveProposal, cancelProposal } from "../api/evolution.api";
import ReasoningTrace from "../trace/ReasoningTrace";
import DiffModal from "../modal/DiffModal";

/**
 * 📬 A3.16 EVOLUTION INBOX (CONTROL ROOM CORE)
 */

export default function EvolutionInbox() {
  const [proposals, setProposals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [diff, setDiff] = useState(null);

  useEffect(() => {
    load();

    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  async function load() {
    const data = await fetchProposals();
    setProposals(data);
  }

  return (
    <div style={{ padding: 20, color: "#fff" }}>

      <h1>🧠 Evolution Inbox</h1>

      {proposals.map((p) => (
        <div key={p.id} style={card}>
          
          <h3>{p.title}</h3>

          <p>{p.explanation}</p>

          <button onClick={() => setSelected(p)}>
            🔍 Open
          </button>

          <button onClick={() => approveProposal(p.id)}>
            ✅ Approve
          </button>

          <button onClick={() => cancelProposal(p.id)}>
            ❌ Cancel
          </button>

          <button onClick={() => setDiff(p.diff)}>
            📊 Diff
          </button>

        </div>
      ))}

      {selected && <ReasoningTrace proposal={selected} />}
      {diff && <DiffModal diff={diff} onClose={() => setDiff(null)} />}

    </div>
  );
}

const card = {
  background: "#111",
  padding: 15,
  marginBottom: 10,
  borderRadius: 10
};
