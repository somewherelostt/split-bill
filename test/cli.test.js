import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../cli.js", import.meta.url));
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });

test("cli prints each person's share", () => {
  const result = run("120", "alice", "bob", "carol");
  assert.equal(result.status, 0);
  assert.equal(result.stdout, "alice: 40.00\nbob: 40.00\ncarol: 40.00\n");
});

test("cli rejects missing names", () => {
  const result = run("120");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /usage/);
});

test("cli rejects a non-numeric total", () => {
  const result = run("abc", "alice");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /usage/);
});
