// Split a shared bill between friends. Amounts are in dollars.

/**
 * Split `total` evenly between `people` (array of names). Returns { name: amount }.
 * Shares always add up to `total`: leftover cents go one each to the first people.
 */
export function splitEvenly(total, people) {
  if (people.length === 0) throw new Error("need at least one person");
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / people.length);
  const leftover = cents - base * people.length;
  return Object.fromEntries(
    people.map((name, i) => [name, (base + (i < leftover ? 1 : 0)) / 100]),
  );
}

/** Split `total` by weights, e.g. { alice: 2, bob: 1 }. Returns { name: amount }. */
export function splitByShares(total, shares) {
  const names = Object.keys(shares);
  const weight = names.reduce((sum, name) => sum + shares[name], 0);
  if (weight <= 0) throw new Error("shares must add up to more than zero");
  return Object.fromEntries(
    names.map((name) => [name, Math.round((total * shares[name] / weight) * 100) / 100]),
  );
}

/**
 * Given what each person paid, return who pays whom so everyone ends up even.
 * paid: { alice: 60, bob: 0, carol: 30 } -> [{ from: "bob", to: "alice", amount: 30 }]
 */
export function settleUp(paid) {
  const names = Object.keys(paid);
  const total = names.reduce((sum, name) => sum + paid[name], 0);
  const fair = total / names.length;
  const balances = names.map((name) => ({ name, balance: paid[name] - fair }));
  const owes = balances.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance);
  const owed = balances.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance);
  const transfers = [];
  for (const debtor of owes) {
    let left = -debtor.balance;
    for (const creditor of owed) {
      if (left <= 0) break;
      if (creditor.balance <= 0) continue;
      const amount = Math.min(left, creditor.balance);
      transfers.push({ from: debtor.name, to: creditor.name, amount: Math.round(amount * 100) / 100 });
      creditor.balance -= amount;
      left -= amount;
    }
  }
  return transfers;
}
