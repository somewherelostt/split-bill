# split-bill

Split a shared bill between friends, down to the cent.

```js
import { splitEvenly, splitByShares, settleUp } from "./src/split.js";

splitEvenly(90, ["alice", "bob", "carol"]);   // { alice: 30, bob: 30, carol: 30 }
splitByShares(90, { alice: 2, bob: 1 });      // { alice: 60, bob: 30 }
settleUp({ alice: 50, bob: 0 });              // [{ from: "bob", to: "alice", amount: 25 }]
```

Run the tests with `npm test` (Node 20 or later, no dependencies).
