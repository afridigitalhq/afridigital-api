const PATTERNS = [
  { keyword: "module not found", type: "DEPENDENCY_ERROR", severity: "HIGH", recommendation: "Install the missing package or correct the import path." },
  { keyword: "cannot find module", type: "MODULE_RESOLUTION", severity: "HIGH", recommendation: "Verify dependencies and import paths." },
  { keyword: "next build failed", type: "NEXTJS_BUILD", severity: "HIGH", recommendation: "Review the Next.js build output and resolve compilation errors." },
  { keyword: "react", type: "REACT_RUNTIME", severity: "MEDIUM", recommendation: "Inspect the React component stack and props." },
  { keyword: "render", type: "RENDER_DEPLOYMENT", severity: "MEDIUM", recommendation: "Check Render deployment logs and environment variables." },
  { keyword: "timeout", type: "TIMEOUT", severity: "MEDIUM", recommendation: "Investigate network latency or long-running operations." },
  { keyword: "exception", type: "EXCEPTION", severity: "HIGH", recommendation: "Review the exception stack trace to identify the root cause." },
  { keyword: "deprecated", type: "DEPRECATION", severity: "LOW", recommendation: "Upgrade to supported APIs or packages." }
];

const CoreKnowledgeEngine = {
  patterns() {
    return PATTERNS;
  }
};

export default CoreKnowledgeEngine;
