# Legacy Bootstrap Audit

## Finding

src/bootstrap/kernel.probe.js does not import legacy code.

It only performs a filesystem existence check:

src/legacy/africore/runtime/server.boot.cjs

## Classification

kernel.probe.js:
SAFE SIGNAL MODE

legacy/africore/runtime/server.boot.cjs:
LEGACY SERVER - NOT PART OF CURRENT CANONICAL RUNTIME

## Decision

No legacy deletion until all legacy boot paths are archived or removed from probes.

Current AfriAI runtime remains independent from legacy kernel paths.
