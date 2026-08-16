import fs from "fs";
import path from "path";

const SOURCE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx"
]);

const IGNORED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".cache"
]);

const NODE_BUILTINS = new Set([
  "assert","assert/strict","async_hooks","buffer","child_process","cluster","console","constants","crypto","dgram","diagnostics_channel","dns","dns/promises","domain","events","fs","fs/promises","http","http2","https","module","net","os","path","path/posix","path/win32","perf_hooks","process","punycode","querystring","readline","readline/promises","repl","stream","stream/consumers","stream/promises","stream/web","string_decoder","sys","timers","timers/promises","tls","trace_events","tty","url","util","util/types","v8","vm","wasi","worker_threads","zlib"
]);

const IGNORED_FILE_PATTERNS = [
  /\.bak/i,
  /\.consolidation/i,
  /\.min\./i
];

function shouldIgnoreFile(file) {
  return IGNORED_FILE_PATTERNS.some(pattern => pattern.test(file));
}

function collectSourceFiles(root) {

  const files = [];

  function walk(directory) {

    for (const entry of fs.readdirSync(directory, { withFileTypes:true })) {

      if (IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (
        entry.isFile() &&
        SOURCE_EXTENSIONS.has(path.extname(entry.name)) &&
        !shouldIgnoreFile(entry.name)
      ) {
        files.push(fullPath);
      }
    }

  }

  walk(root);

  return files;
}

function extractImports(source) {

  const imports = new Set();

  const patterns = [
    /\bimport\s+(?:[^"'`]*?\s+from\s+)?["']([^"']+)["']/g,
    /\bexport\s+(?:[^"'`]*?\s+from\s+)?["']([^"']+)["']/g,
    /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g
  ];

  for (const pattern of patterns) {

    let match;

    while ((match = pattern.exec(source)) !== null) {
      imports.add(match[1]);
    }

  }

  return [...imports];
}

function isLocalImport(specifier) {
  return (
    specifier.startsWith("./") ||
    specifier.startsWith("../") ||
    specifier.startsWith("/")
  );
}

function toRelative(root, file) {
  return path.relative(root, file).split(path.sep).join("/");
}

const AfriDebugDependencyGraphWorker = {

  execute(input = {}) {

    const repository =
      input.repository || {};

    const root =
      repository.path ||
      input.path ||
      process.cwd();

    if (!fs.existsSync(root)) {

      return {

        investigationId:
          input.investigationId || null,

        repository,

        files:0,
        imports:0,
        localImports:0,
        externalImports:0,
        nodes:[],
        edges:[],
        externalDependencies:[],

        status:"GRAPH_FAILED",

        error:`Repository path not found: ${root}`,

        completedAt:Date.now()

      };

    }

    const sourceFiles = collectSourceFiles(root);

    const nodes = sourceFiles.map(file =>
      toRelative(root, file)
    );

    const edges = [];
    const externalDependencies = new Set();
    const builtinDependencies = new Set();

    for (const file of sourceFiles) {

      const source = fs.readFileSync(file, "utf8");
      const imports = extractImports(source);
      const from = toRelative(root, file);

      for (const dependency of imports) {

        const local = isLocalImport(dependency);

        edges.push({
          file:from,
          dependency,
          type:local ? "local" : "external"
        });

        if (!local) {
          externalDependencies.add(dependency);
        }

      }

    }

    const localImports =
      edges.filter(edge => edge.type === "local").length;

    const externalImports =
      edges.filter(edge => edge.type === "external").length;

    const graph = {

      investigationId:
        input.investigationId || null,

      repository,

      root,

      files:sourceFiles.length,

      imports:edges.length,

      localImports,

      externalImports,

      dependencyCount:edges.length,

      externalDependencies:[
        ...externalDependencies
      ].sort(),

      nodes,

      edges,

      status:"GRAPH_COMPLETED",

      completedAt:Date.now()

    };

    return graph;

  }

};

export default AfriDebugDependencyGraphWorker;
