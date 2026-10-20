# Stripe Webhooks Guide

An independent guide to receiving, verifying, and handling Stripe webhook events in Node.js. Built with [Thally](https://thally.io).

Live site: [LIVE_URL]

## Contents

| Path | What it is |
| --- | --- |
| `src/content/` | The documentation pages (MDX) |
| `docs.json` | Navigation |
| `src/data/site.ts` | Site name, description, and links |
| `examples/webhook-server/` | The complete example server, with tests |

## Run the site locally

```bash
npm install
npm run dev
```

Open http://localhost:3040.

## Validate before you push

```bash
npx --yes @thallylabs/cli@latest check
npm run build
```

## Test the example server

```bash
cd examples/webhook-server
npm install
npm test
```

This guide is not affiliated with or endorsed by Stripe.
