async function load() {
  const res = await fetch("/snapshot");
  const data = await res.json();

  document.body.innerHTML = `
    <h2>🌐 AFRIDIGITAL CONTROL PLANE</h2>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  `;
}

setInterval(load, 2000);
load();
