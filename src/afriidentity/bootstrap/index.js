import { getAfriPostgresPool } from "../../platform/database/postgres/AfriPostgresRuntime.js";
import AfriIdentityPostgresRepository from "../repository/AfriIdentityPostgresRepository.js";
import AfriIdentityPasswordService from "../security/AfriIdentityPasswordService.js";
import AfriIdentitySessionService from "../session/AfriIdentitySessionService.js";

let runtime = null;
let initialization = null;

export async function init({ pool: suppliedPool } = {}) {
  if (runtime) return runtime;
  if (initialization) return initialization;

  initialization = (async () => {
    const pool = suppliedPool ?? getAfriPostgresPool();
    const repository = new AfriIdentityPostgresRepository({ pool });
    await repository.initialize();

    const passwordService = new AfriIdentityPasswordService();
    const sessionService = new AfriIdentitySessionService({ repository });

    runtime = Object.freeze({
      repository,
      passwordService,
      sessionService
    });

    console.log("[AfriIdentity] PostgreSQL identity services initialized.");
    return runtime;
  })();

  try {
    return await initialization;
  } catch (error) {
    initialization = null;
    throw error;
  } finally {
    if (runtime) initialization = null;
  }
}

export function getAfriIdentityRuntime() {
  if (!runtime) throw new Error("AFRI_IDENTITY_NOT_INITIALIZED");
  return runtime;
}
