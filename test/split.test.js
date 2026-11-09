import { test } from "node:test";
import assert from "node:assert/strict";
import { splitEvenly, splitByShares, settleUp } from "../src/split.js";

test("splitEvenly splits a round total", () => {
  assert.deepEqual(splitEvenly(90, ["alice", "bob", "carol"]), { alice: 30, bob: 30, carol: 30 });
});

test("splitByShares follows the weights", () => {
  assert.deepEqual(splitByShares(90, { alice: 2, bob: 1 }), { alice: 60, bob: 30 });
});

test("settleUp evens out two people", () => {
  assert.deepEqual(settleUp({ alice: 50, bob: 0 }), [{ from: "bob", to: "alice", amount: 25 }]);
});
