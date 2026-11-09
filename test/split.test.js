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

test("settleUp evens out three people", () => {
  assert.deepEqual(settleUp({ alice: 60, bob: 0, carol: 30 }), [{ from: "bob", to: "alice", amount: 30 }]);
});

test("settleUp returns nothing when everyone paid the same", () => {
  assert.deepEqual(settleUp({ alice: 10, bob: 10, carol: 10 }), []);
});

test("settleUp pairs four people with two debtors and two creditors", () => {
  assert.deepEqual(settleUp({ a: 10, b: 20, c: 30, d: 40 }), [
    { from: "a", to: "d", amount: 15 },
    { from: "b", to: "c", amount: 5 },
  ]);
});

test("settleUp lets one debtor pay several creditors", () => {
  assert.deepEqual(settleUp({ a: 40, b: 40, c: 0, d: 0, e: 70 }), [
    { from: "c", to: "e", amount: 30 },
    { from: "d", to: "e", amount: 10 },
    { from: "d", to: "a", amount: 10 },
    { from: "d", to: "b", amount: 10 },
  ]);
});

test("settleUp never emits zero-amount transfers from floating-point dust", () => {
  const transfers = settleUp({ p0: 98.17, p1: 42.44, p2: 54.58, p3: 79.11, p4: 68.58 });
  assert.ok(transfers.length > 0);
  for (const t of transfers) assert.ok(t.amount > 0, `zero transfer ${JSON.stringify(t)}`);
});

test("settleUp spreads leftover cents instead of piling them on one person", () => {
  const paid = { p0: 0, p1: 0, p2: 26.03, p3: 0, p4: 0 };
  const net = { ...paid };
  for (const t of settleUp(paid)) {
    net[t.from] = Math.round((net[t.from] + t.amount) * 100) / 100;
    net[t.to] = Math.round((net[t.to] - t.amount) * 100) / 100;
  }
  // 26.03 / 5 = 5.206: everyone should end up paying 5.20 or 5.21.
  for (const name of Object.keys(net)) assert.ok([5.2, 5.21].includes(net[name]), `${name} paid ${net[name]}`);
});

test("settleUp transfers always add up to the total owed with many people", () => {
  const paid = { a: 0, b: 0, c: 0, d: 0, e: 100, f: 0, g: 0 };
  const transfers = settleUp(paid);
  const received = transfers.reduce((sum, t) => sum + Math.round(t.amount * 100), 0);
  // e's fair share is 14.28 or 14.29, so e must receive 85.71 or 85.72.
  assert.ok(received === 8571 || received === 8572, `e received ${received / 100}`);
});
