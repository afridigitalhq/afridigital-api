const circuits = new Map();

function get(provider) {
  if (!circuits.has(provider)) {
    circuits.set(provider, { state: "CLOSED", failures: 0 });
  }
  return circuits.get(provider);
}

function fail(provider) {
  const c = get(provider);
  c.failures++;

  if (c.failures >= 3) {
    c.state = "OPEN";
  }
}

function success(provider) {
  const c = get(provider);
  c.failures = 0;
  c.state = "CLOSED";
}

module.exports = { get, fail, success };
