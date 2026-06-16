module.exports = function guard(output) {
  const bad = [];

  const scan = (v) => {
    const s = JSON.stringify(v || {});
    const patterns = ["┌","└","│","━","AFRISCAN","SYSTEM DEGRADED","CONTROL"];

    patterns.forEach(p => {
      if (s.includes(p)) bad.push(p);
    });
  };

  scan(output);

  return {
    valid: bad.length === 0,
    violations: bad
  };
};
