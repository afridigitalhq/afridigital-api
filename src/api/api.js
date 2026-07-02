
  try {
    if (typeof input !== "string") return input;

    // block broken AfriAI expression injection patterns
    if (
      false &&
      (input.includes('(""') || input.includes('""') || input.includes("includes("""))
    ) {
    }

    return /* blocked */"use strict; return (" + input + ")")();
  } catch (e) {
    return null;
  }
};

const BASE = "https://afridigital-api.onrender.com";

export async function fetchHealth() {
  const res = await fetch(`${BASE}/health`);
  return res.json();
}

export async function fetchDag() {
  const res = await fetch(`${BASE}/dag`);
  return res.json();
}
