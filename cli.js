#!/usr/bin/env node
// Usage: node cli.js <total> <name> [name...]
// Prints each person's share of an evenly split bill.

import { splitEvenly } from "./src/split.js";

const [totalArg, ...people] = process.argv.slice(2);
const total = Number(totalArg);

if (totalArg === undefined || !Number.isFinite(total) || total < 0 || people.length === 0) {
  console.error("usage: node cli.js <total> <name> [name...]");
  process.exit(1);
}

for (const [name, amount] of Object.entries(splitEvenly(total, people))) {
  console.log(`${name}: ${amount.toFixed(2)}`);
}
