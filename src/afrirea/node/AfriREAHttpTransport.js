import https from "node:https";
import dns from "node:dns/promises";
import net from "node:net";
import { setTimeout as delay } from "node:timers/promises";

export const USER_AGENT = "MiniAfriREAResearchBot/1.0";
export const TIMEOUT_MS = 8000;
export const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
export const MAX_ROBOTS_BYTES = 256 * 1024;
export const MAX_REDIRECTS = 3;
export const MIN_REQUEST_INTERVAL_MS = 2000;

let lastRequestAt = 0;
let requestQueue = Promise.resolve();

function inV4Range(ip, prefix, bits) {
  const value = ip.split(".").reduce((n, part) => (n << 8n) | BigInt(part), 0n);
  const base = prefix.split(".").reduce((n, part) => (n << 8n) | BigInt(part), 0n);
  const shift = BigInt(32 - bits);
  return (value >> shift) === (base >> shift);
}

function publicIPv4(ip) {
  if (net.isIP(ip) !== 4) return false;
  const blocked = [
    ["0.0.0.0",8],["10.0.0.0",8],["100.64.0.0",10],
    ["127.0.0.0",8],["169.254.0.0",16],["172.16.0.0",12],
    ["192.0.0.0",24],["192.0.2.0",24],["192.88.99.0",24],
    ["192.168.0.0",16],["198.18.0.0",15],["198.51.100.0",24],
    ["203.0.113.0",24],["224.0.0.0",4],["240.0.0.0",4]
  ];
  return !blocked.some(([range,bits]) => inV4Range(ip,range,bits));
}

export function isPublicIp(value) {
  const ip = String(value || "").toLowerCase();
  const family = net.isIP(ip);
  if (family === 4) return publicIPv4(ip);
  if (family !== 6 || ip.includes("%") || ip.includes(".")) return false;
  let canonical;
  try { canonical = new URL("https://[" + ip + "]/").hostname.slice(1,-1).toLowerCase(); }
  catch { return false; }
  const parts = canonical.split(":");
  const first = Number.parseInt(parts[0] || "0",16);
  const second = Number.parseInt(parts[1] || "0",16);
  if (!Number.isInteger(first) || first < 0x2000 || first > 0x3fff) return false;
  if (first === 0x2001 && (second <= 0x01ff || second === 0x0db8)) return false;
  if (first === 0x2002 || (first === 0x3fff && second <= 0x0fff)) return false;
  return true;
}

function normalizedHostname(host) {
  return host.startsWith("[") && host.endsWith("]") ? host.slice(1,-1) : host;
}

export function validateUrl(value) {
  if (typeof value !== "string" || value.length > 2048) throw new Error("URL_INVALID");
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error("URL_INVALID"); }
  if (parsed.protocol !== "https:") throw new Error("HTTPS_REQUIRED");
  if (!parsed.hostname || parsed.username || parsed.password) throw new Error("URL_AUTHORITY_INVALID");
  if (parsed.port && parsed.port !== "443") throw new Error("NONSTANDARD_PORT_BLOCKED");
  parsed.hash = "";
  const host = normalizedHostname(parsed.hostname).replace(/\.$/,"").toLowerCase();
  if (!host || (net.isIP(host) === 0 && /[\/\\@:#%]/.test(host)) || host.endsWith(".local")) throw new Error("HOSTNAME_INVALID");
  const family = net.isIP(host);
  if (family && !isPublicIp(host)) throw new Error("NONPUBLIC_IP_BLOCKED");
  parsed.hostname = family === 6 ? `[${host}]` : host;
  return parsed.href;
}

export async function resolvePublicAddresses(hostname, lookup = dns.lookup) {
  let answers;
  try { answers = await lookup(hostname,{all:true,verbatim:true}); }
  catch { throw new Error("HOST_RESOLUTION_FAILED"); }
  if (!Array.isArray(answers) || answers.length === 0) throw new Error("HOST_RESOLUTION_FAILED");
  const checked = [];
  for (const answer of answers) {
    const address = answer?.address;
    if (!address || !net.isIP(address)) throw new Error("INVALID_DNS_ADDRESS");
    if (!isPublicIp(address)) throw new Error("NONPUBLIC_DNS_ANSWER_BLOCKED");
    if (!checked.includes(address)) checked.push(address);
  }
  return checked.slice(0,8);
}

export function assertSameHost(base, target) {
  const first = new URL(validateUrl(base));
  const next = new URL(validateUrl(target));
  if (normalizedHostname(first.hostname).toLowerCase() !== normalizedHostname(next.hostname).toLowerCase()) {
    throw new Error("CROSS_HOST_REDIRECT_BLOCKED");
  }
  return next.href;
}

export function inspectContentLength(value, maxBytes) {
  if (value == null) return null;
  if (!/^\d+$/.test(String(value))) throw new Error("INVALID_CONTENT_LENGTH");
  const length = Number(value);
  if (!Number.isSafeInteger(length)) throw new Error("INVALID_CONTENT_LENGTH");
  if (length > maxBytes) throw new Error("RESPONSE_SIZE_LIMIT_EXCEEDED");
  return length;
}

function normalizeRobotsText(value) {
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return value;
  }
  const bytes = new TextEncoder().encode(decoded);
  return Array.from(bytes, byte => {
    if (
      (byte >= 65 && byte <= 90) ||
      (byte >= 97 && byte <= 122) ||
      (byte >= 48 && byte <= 57) ||
      byte === 45 || byte === 46 || byte === 95 ||
      byte === 126 || byte === 47
    ) return String.fromCharCode(byte);
    return "%" + byte.toString(16).toUpperCase().padStart(2, "0");
  }).join("");
}

function normalizeRobotsUri(value) {
  const separator = value.indexOf("?");
  const pathname = separator < 0 ? value : value.slice(0, separator);
  const query = separator < 0 ? "" : value.slice(separator + 1);
  return normalizeRobotsText(pathname) +
    (separator < 0 ? "" : "?" + query.replace(/[^=&]+/g, normalizeRobotsText));
}

function normalizeRobotsPattern(value) {
  const separator = value.indexOf("?");
  const pathname = separator < 0 ? value : value.slice(0, separator);
  const query = separator < 0 ? "" : value.slice(separator + 1);
  return pathname.replace(/[^*$]+/g, normalizeRobotsText) +
    (separator < 0 ? "" : "?" + query.replace(/[^=&*$]+/g, normalizeRobotsText));
}

function translateRobotsPattern(path) {
  const escape = value => value.replace(/[.*+?^{}()|[\]\\]/g, "\\$&");
  const parts = path.split("*").map(escape);
  for (let i = 1; i < parts.length - 1; i++) {
    parts[i] = "(?>.*?" + parts[i] + ")";
  }
  parts[parts.length - 1] = ".*" + parts[parts.length - 1];
  return parts.join("");
}

export function parseRobotsPolicy(text, targetUrl, userAgent = USER_AGENT) {
  const groups = new Map();
  let agents = [];
  let rules = [];
  let crawlDelays = [];
  let requestRates = [];
  let state = 0;

  const finish = () => {
    if (agents.length) {
      const entry = {
        agents: [...agents],
        rules: [...rules],
        crawlDelays: [...crawlDelays],
        requestRates: [...requestRates]
      };
      for (const rawAgent of entry.agents) {
        const key = rawAgent.toLowerCase();
        const existing = groups.get(key);
        if (existing) {
          groups.set(key, {
            agents: [...new Set([...existing.agents, ...entry.agents])],
            rules: [...existing.rules, ...entry.rules],
            crawlDelays: [...existing.crawlDelays, ...entry.crawlDelays],
            requestRates: [...existing.requestRates, ...entry.requestRates]
          });
        } else {
          groups.set(key, entry);
        }
      }
    }
    agents = [];
    rules = [];
    crawlDelays = [];
    requestRates = [];
    state = 0;
  };

  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.split("#", 1)[0].trim();
    if (!line) continue;
    const colon = line.indexOf(":");
    if (colon < 0) continue;

    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (key === "user-agent") {
      if (state === 2) finish();
      agents.push(value.toLowerCase());
      state = 1;
    } else if ((key === "allow" || key === "disallow") && state !== 0) {
      state = 2;
      let path = value.replace(/\*{2,}/g, "*");
      path = path.replace(/\$[$*]+/g, "$");
      path = normalizeRobotsPattern(path);
      rules.push({ allow: key === "allow" || path === "", path });
    } else if (key === "crawl-delay" && state !== 0) {
      state = 2;
      if (/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) {
        const seconds = Number(value);
        if (Number.isFinite(seconds) && seconds >= 0) {
          crawlDelays.push(Math.min(3600000, Math.ceil(seconds * 1000)));
        }
      }
    } else if (key === "request-rate" && state !== 0) {
      state = 2;
      const match = /^(\d+)\s*\/\s*(\d+(?:\.\d*)?|\.\d+)$/.exec(value);
      if (match) {
        const requests = Number(match[1]);
        const seconds = Number(match[2]);
        if (Number.isSafeInteger(requests) && requests > 0 &&
            Number.isFinite(seconds) && seconds > 0) {
          requestRates.push(Math.min(3600000, Math.ceil(seconds * 1000 / requests)));
        }
      }
    }
  }
  finish();

  const url = new URL(targetUrl);
  const path = normalizeRobotsUri(url.pathname + url.search);
  if (path === "/robots.txt") {
    return { allowed: true, minRequestIntervalMs: MIN_REQUEST_INTERVAL_MS };
  }

  const fullAgent = String(userAgent).toLowerCase();
  let selected = groups.get(fullAgent);

  if (!selected) {
    const productToken = fullAgent.split("/", 1)[0];
    for (const entry of groups.values()) {
      if (entry.agents.some(name => name !== "*" && productToken.includes(name))) {
        selected = entry;
        break;
      }
    }
  }
  if (!selected) selected = groups.get("*");

  if (!selected) {
    return { allowed: true, minRequestIntervalMs: MIN_REQUEST_INTERVAL_MS };
  }

  let bestLength = 0;
  let allowed = true;

  for (const rule of selected.rules) {
    const anchored = rule.path.endsWith("$");
    const body = anchored ? rule.path.slice(0, -1) : rule.path;
    if (body.includes("$")) continue;

    let matchLength = 0;
    if (!body.includes("*")) {
      if (anchored ? path === body : path.startsWith(body)) {
        matchLength = body.length + 1;
      }
    } else {
      const expression = new RegExp(
        "^(?:" + translateRobotsPattern(body) + ")" + (anchored ? "$" : "")
      );
      const match = expression.exec(path);
      if (match) matchLength = match[0].length + 1;
    }

    if (
      matchLength > bestLength ||
      (matchLength > 0 && matchLength === bestLength && rule.allow && !allowed)
    ) {
      bestLength = matchLength;
      allowed = rule.allow;
    }
  }

  return {
    allowed: bestLength === 0 ? true : allowed,
    minRequestIntervalMs: Math.max(
      MIN_REQUEST_INTERVAL_MS,
      ...selected.crawlDelays,
      ...selected.requestRates
    )
  };
}

export function parseRobots(text, targetUrl, userAgent = USER_AGENT) {
  return parseRobotsPolicy(text, targetUrl, userAgent).allowed;
}

async function pacedStart(minRequestIntervalMs = MIN_REQUEST_INTERVAL_MS) {
  const task = requestQueue.then(async () => {
    const interval = Math.max(MIN_REQUEST_INTERVAL_MS, Number.isFinite(minRequestIntervalMs) ? minRequestIntervalMs : MIN_REQUEST_INTERVAL_MS);
    const wait = interval - (Date.now() - lastRequestAt);
    if (lastRequestAt && wait > 0) await delay(wait);
    lastRequestAt = Date.now();
  });
  requestQueue = task.catch(() => {});
  await task;
}

function requestPinned(url, pinnedIp, maxBytes, requestImpl = https.request) {
  return new Promise((resolve,reject) => {
    const parsed = new URL(url);
    const host = normalizedHostname(parsed.hostname);
    const family = net.isIP(pinnedIp);
    const options = {
      protocol:"https:",
      hostname:host,
      port:443,
      method:"GET",
      path:parsed.pathname + parsed.search,
      servername:net.isIP(host) ? undefined : host,
      rejectUnauthorized:true,
      agent:false,
      timeout:TIMEOUT_MS,
      lookup:(_hostname,options,callback) => options?.all ? callback(null,[{address:pinnedIp,family}]) : callback(null,pinnedIp,family),
      headers:{
        Host:family === 6 ? "["+host+"]" : host,
        "User-Agent":USER_AGENT,
        "Accept-Encoding":"identity",
        Connection:"close"
      }
    };
    const request = requestImpl(options,response => {
      const status = response.statusCode || 0;
      const location = response.headers.location || null;
      if ([301,302,303,307,308].includes(status) || status >= 400) {
        response.destroy();
        return resolve({status,location,url,body:Buffer.alloc(0),content_type:""});
      }
      let length;
      try { length = inspectContentLength(response.headers["content-length"],maxBytes); }
      catch (error) {
        response.destroy();
        return resolve({status,location:null,url,body:Buffer.alloc(0),content_type:"",error:error.message});
      }
      const chunks = [];
      let size = 0;
      response.on("data",chunk => {
        size += chunk.length;
        if (size > maxBytes) {
          response.destroy(new Error("RESPONSE_SIZE_LIMIT_EXCEEDED"));
          return;
        }
        chunks.push(chunk);
      });
      response.on("end",() => {
        if (length !== null && size !== length) {
          return resolve({status,location:null,url,body:Buffer.alloc(0),content_type:"",error:"RESPONSE_LENGTH_MISMATCH"});
        }
        const contentType = String(response.headers["content-type"] || "").split(";",1)[0].trim().toLowerCase();
        resolve({status,location:null,url,body:Buffer.concat(chunks),content_type:contentType});
      });
      response.on("error",error => resolve({status,location:null,url,body:Buffer.alloc(0),content_type:"",error:error.message}));
    });
    request.on("timeout",() => request.destroy(new Error("HTTPS_REQUEST_TIMEOUT")));
    request.on("error",error => reject(error));
    request.end();
  });
}

export async function requestOnce(url,{maxBytes=MAX_RESPONSE_BYTES,allowedTypes=null,lookup=dns.lookup,request=https.request,pace=pacedStart,minRequestIntervalMs=MIN_REQUEST_INTERVAL_MS}={}) {
  const normalized = validateUrl(url);
  const parsed = new URL(normalized);
  const host = normalizedHostname(parsed.hostname);
  const literal = net.isIP(host);
  const addresses = literal ? [host] : await resolvePublicAddresses(host,lookup);
  let lastError;
  for (const address of addresses) {
    try {
      await pace(minRequestIntervalMs);
      const result = await requestPinned(normalized,address,maxBytes,request);
      if (result.error) return result;
      if (allowedTypes && result.status < 400 && ![301,302,303,307,308].includes(result.status) && !allowedTypes.has(result.content_type)) {
        return {...result,body:Buffer.alloc(0),error:"CONTENT_TYPE_BLOCKED"};
      }
      return result;
    } catch (error) { lastError = error; }
  }
  throw new Error("HTTPS_REQUEST_FAILED",{cause:lastError});
}

export async function safeGet(url,{maxBytes=MAX_RESPONSE_BYTES,allowedTypes=null,requestOnceImpl=requestOnce,minRequestIntervalMs=MIN_REQUEST_INTERVAL_MS}={}) {
  let current = validateUrl(url);
  const originalHost = normalizedHostname(new URL(current).hostname).toLowerCase();
  for (let redirects=0; redirects<=MAX_REDIRECTS; redirects++) {
    const result = await requestOnceImpl(current,{maxBytes,allowedTypes,minRequestIntervalMs});
    if (result.error) return result;
    if (![301,302,303,307,308].includes(result.status)) return result;
    if (redirects === MAX_REDIRECTS) return {error:"REDIRECT_LIMIT_EXCEEDED",url:current};
    if (!result.location) return {error:"REDIRECT_WITHOUT_LOCATION",url:current};
    let target;
    try { target = new URL(result.location,current).href; }
    catch { return {error:"INVALID_REDIRECT_DESTINATION",url:current}; }
    try {
      const validated = validateUrl(target);
      current = assertSameHost(current,validated);
    } catch (error) {
      return {error:error.message === "CROSS_HOST_REDIRECT_BLOCKED" ? error.message : "INVALID_REDIRECT_DESTINATION",url:target};
    }
    if (normalizedHostname(new URL(current).hostname).toLowerCase() !== originalHost) {
      return {error:"CROSS_HOST_REDIRECT_BLOCKED",url:current};
    }
  }
  return {error:"REDIRECT_LIMIT_EXCEEDED",url:current};
}

export async function checkRobots(url,{safeGetImpl=safeGet}={}) {
  let normalized;
  try { normalized = validateUrl(url); }
  catch { return {allowed:false,reason:"URL_INVALID"}; }
  const parsed = new URL(normalized);
  const robotsUrl = `${parsed.origin}/robots.txt`;
  let result;
  try {
    result = await safeGetImpl(robotsUrl,{maxBytes:MAX_ROBOTS_BYTES,allowedTypes:new Set(["text/plain","application/octet-stream"])});
  } catch {
    return {allowed:false,reason:"ROBOTS_FETCH_FAILED"};
  }
  if (result.error) return {allowed:false,reason:result.error};
  if (result.status === 404) return {allowed:true,reason:"ROBOTS_NOT_FOUND"};
  if (result.status !== 200) return {allowed:false,reason:"ROBOTS_HTTP_ERROR"};
  const policy = parseRobotsPolicy(result.body.toString("utf8"),normalized);
  return {...policy,reason:"ROBOTS_POLICY_CHECKED"};
}

export async function fetchPage(url,{checkRobotsImpl=checkRobots,safeGetImpl=safeGet}={}) {
  let normalized;
  try { normalized = validateUrl(url); }
  catch (error) { return {ok:false,reason:error.message || "URL_INVALID"}; }
  const policy = await checkRobotsImpl(normalized);
  if (!policy.allowed) return {ok:false,reason:policy.reason};
  let result;
  try {
    result = await safeGetImpl(normalized,{maxBytes:MAX_RESPONSE_BYTES,allowedTypes:new Set(["text/html","application/xhtml+xml"]),minRequestIntervalMs:policy.minRequestIntervalMs ?? MIN_REQUEST_INTERVAL_MS});
  } catch {
    return {ok:false,reason:"PAGE_FETCH_FAILED"};
  }
  if (result.error) return {ok:false,reason:result.error};
  if (result.status !== 200) return {ok:false,reason:"PAGE_HTTP_ERROR"};
  return {ok:true,url:result.url,content_type:result.content_type,bytes:result.body.length,body:result.body};
}
