function classify(event) {
  if (!event || !event.event) return "gray";

  const e = JSON.stringify(event.event).toLowerCase();

  if (e.includes("rollback")) return "red";
  if (e.includes("deploy")) return "orange";
  if (e.includes("approve")) return "green";
  if (e.includes("ci")) return "blue";
  if (e.includes("error")) return "red";

  return "gray";
}

module.exports = { classify };
