import test from "node:test";
import assert from "node:assert/strict";
import { init, getAfriIdentityRuntime } from "./index.js";

test("AfriIdentity bootstrap retries failures and reuses its initialized runtime", async () => {
  assert.throws(() => getAfriIdentityRuntime(), {
    message: "AFRI_IDENTITY_NOT_INITIALIZED"
  });

  const failingPool = {
    async query() {
      throw new Error("DATABASE_TEST_FAILURE");
    }
  };

  await assert.rejects(
    init({ pool: failingPool }),
    /DATABASE_TEST_FAILURE/
  );

  const successfulPool = {
    calls: 0,
    async query() {
      this.calls += 1;
      return { rows: [] };
    }
  };

  const first = await init({ pool: successfulPool });

  assert.ok(first.repository);
  assert.equal(typeof first.passwordService.constructor.hash, "function");
  assert.equal(typeof first.sessionService.authenticate, "function");
  assert.equal(getAfriIdentityRuntime(), first);
  assert.ok(successfulPool.calls > 0);

  const second = await init({ pool: failingPool });
  assert.equal(second, first);
});
