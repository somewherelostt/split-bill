# split-bill

Split a shared bill between friends, down to the cent.

```js
import { splitEvenly, splitByShares, settleUp } from "./src/split.js";

splitEvenly(90, ["alice", "bob", "carol"]);   // { alice: 30, bob: 30, carol: 30 }
splitByShares(90, { alice: 2, bob: 1 });      // { alice: 60, bob: 30 }
settleUp({ alice: 50, bob: 0 });              // [{ from: "bob", to: "alice", amount: 25 }]
```

## Command line

```sh
$ node cli.js 120 alice bob carol
alice: 40.00
bob: 40.00
carol: 40.00
```

The first argument is the total; the rest are the people splitting it evenly.

Run the tests with `npm test` (Node 20 or later, no dependencies).
