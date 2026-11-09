import { test } from "node:test";
import assert from "node:assert/strict";
import { splitEvenly, splitByShares, settleUp } from "../src/split.js";

test("splitEvenly splits a round total", () => {
  assert.deepEqual(splitEvenly(90, ["alice", "bob", "carol"]), { alice: 30, bob: 30, carol: 30 });
});

test("splitEvenly shares add up to the total when cents don't divide evenly", () => {
  const shares = splitEvenly(100, ["alice", "bob", "carol"]);
  assert.deepEqual(shares, { alice: 33.34, bob: 33.33, carol: 33.33 });
  const sumCents = Object.values(shares).reduce((sum, amount) => sum + Math.round(amount * 100), 0);
  assert.equal(sumCents, 10000);
});

test("splitByShares follows the weights", () => {
  assert.deepEqual(splitByShares(90, { alice: 2, bob: 1 }), { alice: 60, bob: 30 });
});

test("settleUp evens out two people", () => {
  assert.deepEqual(settleUp({ alice: 50, bob: 0 }), [{ from: "bob", to: "alice", amount: 25 }]);
});
