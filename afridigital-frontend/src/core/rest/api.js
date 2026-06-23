const BASE = "https://afridigital-api.onrender.com";

export async function fetchHealth() {
  const res = await fetch(`${BASE}/health`);
  return res.json();
}

export async function fetchDag() {
  const res = await fetch(`${BASE}/dag`);
  return res.json();
}
