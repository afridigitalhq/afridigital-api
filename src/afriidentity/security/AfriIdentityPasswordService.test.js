import test from "node:test";
import assert from "node:assert/strict";
import PasswordService from "./AfriIdentityPasswordService.js";

test("hashes passwords using the configured scrypt format", async () => {
  const hash = await PasswordService.hash("Correct-Horse-Battery-2026");
  const parts = hash.split("$");

  assert.equal(parts.length, 6);
  assert.equal(parts[0], "scrypt");
  assert.equal(parts[1], "16384");
  assert.equal(parts[2], "8");
  assert.equal(parts[3], "1");
  assert.match(parts[4], /^[a-f0-9]{32}$/);
  assert.match(parts[5], /^[a-f0-9]{128}$/);
});

test("generates unique salted hashes for the same password", async () => {
  const password = "Correct-Horse-Battery-2026";
  const first = await PasswordService.hash(password);
  const second = await PasswordService.hash(password);

  assert.notEqual(first, second);
  assert.equal(await PasswordService.verify(password, first), true);
  assert.equal(await PasswordService.verify(password, second), true);
});

test("rejects an incorrect password", async () => {
  const hash = await PasswordService.hash("Correct-Horse-Battery-2026");
  assert.equal(await PasswordService.verify("Wrong-Password-2026", hash), false);
});

test("rejects malformed or unsupported hashes", async () => {
  for (const hash of [
    "",
    "plaintext",
    "bcrypt$16384$8$1$" + "a".repeat(32) + "$" + "b".repeat(128),
    "scrypt$999999999$8$1$" + "a".repeat(32) + "$" + "b".repeat(128),
    "scrypt$16384$8$1$invalid$invalid"
  ]) {
    assert.equal(await PasswordService.verify("Any-Password-2026", hash), false);
  }
});

test("rejects passwords outside the accepted length", async () => {
  for (const password of ["short", "", "x".repeat(1025), null, 12345]) {
    await assert.rejects(
      PasswordService.hash(password),
      { message: "AFRI_IDENTITY_PASSWORD_INVALID" }
    );
  }
});

test("does not expose password material in the encoded hash", async () => {
  const password = "Unique-Secret-Phrase-2026";
  const hash = await PasswordService.hash(password);
  assert.equal(hash.includes(password), false);
});
