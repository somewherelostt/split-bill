// Split a shared bill between friends. Amounts are in dollars.

/** Split `total` evenly between `people` (array of names). Returns { name: amount }. */
export function splitEvenly(total, people) {
  if (people.length === 0) throw new Error("need at least one person");
  const share = Math.floor((total / people.length) * 100) / 100;
  return Object.fromEntries(people.map((name) => [name, share]));
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
  // Work in whole cents so balances are exact and leftover cents can be shared out.
  const cents = names.map((name) => Math.round(paid[name] * 100));
  const total = cents.reduce((sum, c) => sum + c, 0);
  const base = Math.floor(total / names.length);
  const extra = total - base * names.length;
  const balances = names.map((name, i) => ({ name, balance: cents[i] - base - (i < extra ? 1 : 0) }));
  const owes = balances.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance);
  const owed = balances.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance);
  const transfers = [];
  for (const debtor of owes) {
    let left = -debtor.balance;
    for (const creditor of owed) {
      if (left <= 0) break;
      if (creditor.balance <= 0) continue;
      const amount = Math.min(left, creditor.balance);
      transfers.push({ from: debtor.name, to: creditor.name, amount: amount / 100 });
      creditor.balance -= amount;
      left -= amount;
    }
  }
  return transfers;
}
