class DependencyResolver {
  resolve(manifest, registry) {
    const deps = manifest.dependencies || [];
    const available = new Set((registry || []).map(p => p.id));

    const missing = deps.filter(d => !available.has(d));

    return {
      ok: missing.length === 0,
      dependencies: deps,
      missing
    };
  }
}

module.exports = new DependencyResolver();
