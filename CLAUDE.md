# CLAUDE.md — cart (IA#1)

Rules for any assistant (or person) working in this repository. Read this
before changing anything.

## What this project is

One pure function, `cartTotal(items, options)` in `src/cart.js`, that prices a
shopping cart in Vietnamese đồng. The specification lives in `README.md`
("What to implement"); this file does not restate it — the README wins if the
two ever disagree.

## Stack

- Node.js 20 or newer, ES modules (`"type": "module"` — use `import`/`export`,
  never `require`)
- Tests: the built-in `node:test` runner and `node:assert/strict`
- Formatting: Prettier (dev dependency only), config in `.prettierrc.json` —
  no semicolons, single quotes
- CI: GitHub Actions, `.github/workflows/ci.yml`, runs on every push and PR

## Commands

| What                        | Command                |
| --------------------------- | ---------------------- |
| Install (clean, from lock)  | `npm ci`               |
| Run the tests               | `npm test`             |
| Check formatting (the gate) | `npm run format:check` |
| Fix formatting              | `npm run format`       |

**The gate:** a change is done only when `npm run format:check` and
`npm test` both pass locally. CI runs the same two commands on Node 20 and 22.

## Layout

```
src/cart.js          cartTotal — the only production code
test/cart.test.js    tests for cartTotal, one behaviour per test
.github/workflows/   CI
README.md            the specification (do not edit)
```

## The contract, in one screen

- Returns `subtotal + VAT + shipping` as a **number**, `Math.round`ed to the
  whole đồng.
- Shipping is `0` when `subtotal >= freeShipFrom` (the threshold itself is
  free), otherwise `shipFee`.
- Empty cart → `0` (no VAT, no shipping).
- Negative `price`, or `qty` that is not a positive integer → `RangeError`.
- Worked example: 2 × 180000 + 1 × 45000, VAT 0.08, threshold 500000, fee
  30000 → `467400`.

## Rules

- Only touch `src/cart.js` and `test/cart.test.js` for feature work. Changing
  `package.json`, CI, or this file needs a stated reason.
- Every rule in the contract has its own test. A test asserts one behaviour
  and can fail for one reason; name it after the rule, not the code.
- Tests assert the specification (expected numbers worked out by hand in a
  comment), not whatever the implementation currently returns.
- Validate every item before computing anything.

## Never

- **Never add a runtime dependency.** `dependencies` in `package.json` stays
  empty; Prettier is the only dev dependency.
- **Never use `toFixed`** (or anything else that returns a string) for the
  total — the result must be a `number`.
- Never delete, skip (`test.skip`/`todo`) or weaken a test to make the gate
  pass; fix the code instead.
- Never change the worked-example test's expected value `467400`.
- Never edit `README.md` — it is the specification.
- Never commit `node_modules/` or `.env`.
- Never push with a red gate.
