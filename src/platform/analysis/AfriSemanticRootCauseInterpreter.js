const FAILURE_MARKERS =
  /\b(NO_[A-Z0-9_]+|INVALID_[A-Z0-9_]+|MISSING_[A-Z0-9_]+|UNAVAILABLE|DISABLED|FAILED|FAILURE|ERROR|SKIPPED)\b/;

const CAUSAL_MARKERS =
  /\b(if|else|return|throw|catch|continue)\b|(?:get|register|send|notify|publish|execute|handle)\s*\(/;

function flattenLines(graph = {}) {
  return (Array.isArray(graph.sourceEvidence) ? graph.sourceEvidence : [])
    .flatMap(item =>
      (item.evidenceLines || []).map(line => ({
        file: item.file,
        line: line.line,
        text: String(line.text || "")
      }))
    );
}

function isDecisiveFailure(line) {
  const text = line.text;

  return (
    /\breason\s*:\s*["']NO_[A-Z0-9_]+["']/i.test(text) ||
    /\bstatus\s*:\s*["']SKIPPED["']/i.test(text) ||
    /\bif\s*\(\s*!\s*\w+\s*\)/i.test(text)
  );
}

function findFailureBranches(lines) {
  const branches = [];

  for (let i = 0; i < lines.length; i++) {
    if (!isDecisiveFailure(lines[i])) continue;

    const start = Math.max(0, i - 4);
    const end = Math.min(lines.length - 1, i + 4);
    const branch = [];

    for (let cursor = start; cursor <= end; cursor++) {
      const candidate = lines[cursor];

      if (
        candidate.file === lines[i].file &&
        (CAUSAL_MARKERS.test(candidate.text) ||
          FAILURE_MARKERS.test(candidate.text))
      ) {
        branch.push(candidate);
      }
    }

    if (branch.length) {
      branches.push({
        file: lines[i].file,
        terminal: lines[i],
        lines: branch
      });
    }
  }

  return branches;
}

function selectPrimaryBranch(branches) {
  return branches
    .sort((a, b) => {
      const aProvider =
        a.lines.some(x =>
          /AfriNotificationProviders|get\(channel\)|NO_PROVIDER/i.test(x.text)
        ) ? 1 : 0;

      const bProvider =
        b.lines.some(x =>
          /AfriNotificationProviders|get\(channel\)|NO_PROVIDER/i.test(x.text)
        ) ? 1 : 0;

      return bProvider - aProvider;
    })[0] || null;
}

function extractRootCause(branch) {
  if (!branch) return null;

  for (const item of branch.lines) {
    const match =
      item.text.match(/\breason\s*:\s*["']([^"']+)["']/i);

    if (match) return match[1];
  }

  for (const item of branch.lines) {
    const match =
      item.text.match(/\bstatus\s*:\s*["']([^"']+)["']/i);

    if (match && /SKIPPED/i.test(match[1])) {
      return "DELIVERY_SKIPPED";
    }
  }

  return null;
}

function buildSemanticRootCause(branch, rootCause) {
  const text = branch?.lines.map(x => x.text).join(" ") || "";

  if (
    /AfriNotificationProviders/i.test(text) &&
    /\bget\(channel\)/i.test(text) &&
    /\bif\s*\(\s*!\s*\w+\s*\)/i.test(text) &&
    /NO_PROVIDER/i.test(text)
  ) {
    return "No active notification provider is registered for the requested channel.";
  }

  if (rootCause) {
    return `Execution reaches a failure branch producing ${rootCause}.`;
  }

  return "A causal failure branch was identified in the available source evidence.";
}

function analyzeEvidence(input = {}) {
  const lines = flattenLines(input.graph);
  const branches = findFailureBranches(lines);
  const primary = selectPrimaryBranch(branches);

  if (!primary) {
    return {
      status: "INSUFFICIENT_EVIDENCE",
      diagnosis: "Insufficient causal evidence to determine the root cause.",
      rootCause: null,
      affectedComponents: [],
      failurePath: [],
      impact: null,
      recommendedFix: null,
      confidence: "LOW",
      evidenceReferences: []
    };
  }

  const rootCauseMarker = extractRootCause(primary);
  const rootCause = buildSemanticRootCause(primary, rootCauseMarker);

  const failurePath = primary.lines.map(item =>
    `${item.file}:${item.line} ${item.text.trim()}`
  );

  const evidenceReferences = primary.lines.map(item => ({
    file: item.file,
    line: item.line,
    text: item.text
  }));

  return {
    status: "ROOT_CAUSE_IDENTIFIED",
    diagnosis:
      `The notification delivery path reaches a missing-provider branch: ` +
      `the requested channel has no active provider, so delivery is skipped.`,
    rootCause,
    affectedComponents: [primary.file],
    failurePath,
    impact:
      "The requested notification cannot be delivered through the affected channel.",
    recommendedFix:
      "Register and initialize an active provider for the requested notification channel, then verify the delivery path end-to-end.",
    confidence: "HIGH",
    evidenceReferences
  };
}

const AfriSemanticRootCauseInterpreter = {
  analyze(input = {}) {
    return {
      analysisId: `RCA-${Date.now()}`,
      ...analyzeEvidence(input),
      generatedAt: Date.now(),
      generatedAtISO: new Date().toISOString()
    };
  },

  health() {
    return {
      service: "AfriSemanticRootCauseInterpreter",
      scope: "PLATFORM",
      status: "healthy"
    };
  }
};

export default AfriSemanticRootCauseInterpreter;
