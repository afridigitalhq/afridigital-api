import { Pool } from "pg";

let pool;
let initialization;

export async function initializeAfriPostgres() {
  if (pool) return pool;
  if (initialization) return initialization;

  initialization = (async () => {
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString) {
      console.warn("[AfriPostgres] DATABASE_URL is not configured; PostgreSQL services are unavailable.");
      return null;
    }

    const requestedMax = Number.parseInt(process.env.PG_POOL_MAX ?? "5", 10);
    const max = Number.isInteger(requestedMax) && requestedMax > 0 && requestedMax <= 20 ? requestedMax : 5;
    const candidate = new Pool({
      connectionString,
      max,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      application_name: "afridigital-api",
      ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false }
    });

    candidate.on("error", error => {
      console.error("[AfriPostgres] Idle connection error:", error?.code || "UNKNOWN");
    });

    try {
      await candidate.query("SELECT 1");
      pool = candidate;
      console.log("[AfriPostgres] PostgreSQL connection verified.");
      return pool;
    } catch (error) {
      await candidate.end().catch(() => {});
      console.error("[AfriPostgres] Connection failed:", error?.code || "UNKNOWN");
      throw new Error("AFRI_POSTGRES_CONNECTION_FAILED");
    }
  })();

  try {
    return await initialization;
  } finally {
    initialization = undefined;
  }
}

export function getAfriPostgresPool() {
  if (!pool) throw new Error("AFRI_POSTGRES_NOT_INITIALIZED");
  return pool;
}

export async function closeAfriPostgres() {
  if (!pool) return;
  const current = pool;
  pool = undefined;
  await current.end();
}
