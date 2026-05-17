/**
 * 🌐 EVOLUTION API CLIENT
 */

export async function fetchProposals() {
  const res = await fetch("https://afridigital-api.onrender.com/api/evolution/queue");
  return res.json();
}

export async function approveProposal(id) {
  return fetch(`https://afridigital-api.onrender.com/api/evolution/approve/${id}`, {
    method: "POST"
  });
}

export async function cancelProposal(id) {
  return fetch(`https://afridigital-api.onrender.com/api/evolution/cancel/${id}`, {
    method: "POST"
  });
}
