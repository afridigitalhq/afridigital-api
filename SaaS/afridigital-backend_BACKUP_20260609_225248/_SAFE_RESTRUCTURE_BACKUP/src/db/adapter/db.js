/**
 * DB ADAPTER LAYER (PLUG & PLAY CORE)
 * Swap Mongo / Postgres / Redis without touching business logic
 */

let driver = null;

function register(dbDriver) {
  driver = dbDriver;
}

function getDriver() {
  if (!driver) throw new Error("DB_DRIVER_NOT_INITIALIZED");
  return driver;
}

module.exports = { register, getDriver };
