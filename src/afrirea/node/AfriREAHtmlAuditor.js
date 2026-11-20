import { createHash } from "node:crypto";
import { Buffer } from "node:buffer";
import { decodeHTML } from "entities";

const VOID_TAGS = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
const SKIP_TAGS = new Set(["script","style","noscript","svg","template"]);
function readTag(source, start) {
  if (source.startsWith("<!--", start)) {
    const end = source.indexOf("-->", start + 4);
    return { end: end < 0 ? source.length : end + 3, comment: true };
  }
  let quote = "";
  let end = start + 1;
  for (; end < source.length; end++) {
    const char = source[end];
    if (quote) { if (char === quote) quote = ""; }
    else if (char === '"' || char === "'") quote = char;
    else if (char === ">") break;
  }
  if (end >= source.length) return { end: source.length, text: source.slice(start), invalid: true };
  return { end: end + 1, text: source.slice(start + 1, end) };
}

function parseAttributes(source) {
  const attrs = Object.create(null);
  const pattern = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;
  while ((match = pattern.exec(source))) {
    const key = match[1].toLowerCase();
    if (!(key in attrs)) attrs[key] = decodeHTML(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attrs;
}

function resolveWebUrl(base, value) {
  try {
    const target = new URL(value, base);
    return target.protocol === "http:" || target.protocol === "https:" ? target.href : null;
  } catch { return null; }
}

export function inspectHtml(url, html, statusCode = 200, contentType = "text/html") {
  if (typeof url !== "string" || typeof html !== "string") throw new TypeError("AFRIREA_HTML_INPUT_INVALID");
  let base;
  try { base = new URL(url); } catch { throw new TypeError("AFRIREA_BASE_URL_INVALID"); }
  const title = [];
  let thisDescription = "";
  const headings = [];
  const links = [];
  const forms = [];
  const fields = [];
  const textParts = [];
  const skipStack = [];
  let activeHeading = null;
  let activeForm = null;
  let activeAnchor = null;
  let inTitle = false;

  const finishHeading = () => {
    if (!activeHeading) return;
    activeHeading.text = activeHeading.text.trim();
    if (activeHeading.text) headings.push(activeHeading);
    activeHeading = null;
  };

  const appendText = raw => {
    const value = decodeHTML(raw).replace(/\s+/g, " ").trim();
    if (!value || skipStack.length) return;
    if (inTitle) title.push(value);
    if (activeHeading) activeHeading.text += `${value} `;
    textParts.push(value);
    if (activeAnchor) activeAnchor.text = `${activeAnchor.text} ${value}`.trim();
  };

  let index = 0;
  while (index < html.length) {
    if (html[index] !== "<") {
      const next = html.indexOf("<", index);
      appendText(html.slice(index, next < 0 ? html.length : next));
      index = next < 0 ? html.length : next;
      continue;
    }

    const next = html[index + 1] || "";
    const isTagStart = /[A-Za-z!?]/.test(next) || (next === "/" && /[A-Za-z]/.test(html[index + 2] || ""));
    if (!isTagStart) {
      appendText("<");
      index++;
      continue;
    }

    const token = readTag(html, index);
    index = token.end;
    if (token.comment || token.invalid || !token.text) continue;
    const raw = token.text.trim();
    if (!raw || raw[0] === "!" || raw[0] === "?") continue;
    const closing = raw[0] === "/";
    const selfClosing = /\/\s*$/.test(raw);
    const body = raw.replace(/^\/\s*/, "").replace(/\/\s*$/, "");
    const match = /^([^\s/>]+)/.exec(body);
    if (!match) continue;
    const tag = match[1].toLowerCase();

    if (closing) {
      if (SKIP_TAGS.has(tag)) {
        const position = skipStack.lastIndexOf(tag);
        if (position >= 0) skipStack.splice(position, 1);
        continue;
      }
      if (skipStack.length) continue;
      if (tag === "title") inTitle = false;
      if (/^h[1-6]$/.test(tag)) finishHeading();
      if (tag === "a") activeAnchor = null;
      if (tag === "form") activeForm = null;
      continue;
    }

    if (SKIP_TAGS.has(tag)) {
      if (!selfClosing && !VOID_TAGS.has(tag)) skipStack.push(tag);
      continue;
    }
    if (skipStack.length) continue;

    const attrs = parseAttributes(body.slice(match[0].length));
    if (tag === "title") inTitle = true;
    if (/^h[1-6]$/.test(tag)) {
      finishHeading();
      activeHeading = { level: Number(tag[1]), text: "" };
    }

    if (tag === "meta" && (attrs.name || "").toLowerCase() === "description") {
      thisDescription = attrs.content || "";
    }

    if (tag === "a") {
      activeAnchor = null;
      if (attrs.href) {
        const target = resolveWebUrl(base.href, attrs.href);
        if (target) {
          const internal = new URL(target).host.toLowerCase() === base.host.toLowerCase();
          links.push({ url: target, text: "", internal });
          activeAnchor = links[links.length - 1];
        }
      }
    }

    if (tag === "form") {
      activeForm = {
        action: resolveWebUrl(base.href, attrs.action || "") || base.href,
        method: (attrs.method || "get").toLowerCase(),
        fields: []
      };
      forms.push(activeForm);
    }

    if (["input","textarea","select","button"].includes(tag)) {
      const field = {
        element: tag,
        type: attrs.type || "",
        name: attrs.name || "",
        placeholder: attrs.placeholder || "",
        aria_label: attrs["aria-label"] || ""
      };
      fields.push(field);
      if (activeForm) activeForm.fields.push(field);
    }

    if (selfClosing && /^h[1-6]$/.test(tag)) finishHeading();
    if (selfClosing && tag === "title") inTitle = false;
    if (selfClosing && tag === "a") activeAnchor = null;
    if (selfClosing && tag === "form") activeForm = null;
  }

  finishHeading();

  const htmlBytes = Buffer.byteLength(html, "utf8");
  return {
    schema_version: 2,
    url: base.href,
    http_status: statusCode,
    content_type: contentType,
    html_bytes: htmlBytes,
    sha256: createHash("sha256").update(html, "utf8").digest("hex"),
    title: title.join(" ").trim(),
    description: thisDescription || "",
    headings,
    links,
    internal_links: links.filter(item => item.internal),
    external_links: links.filter(item => !item.internal),
    forms,
    fields,
    text_excerpt: textParts.join(" ").slice(0, 12000),
    limitation: "Static HTML only; JavaScript-rendered content and real interactions are not tested."
  };
}
