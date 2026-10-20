# Example webhook server

The complete server from the [Stripe Webhooks guide](../../src/content/guides/handle-events-reliably.mdx).
It verifies signatures, skips duplicate events, and maps event types to handlers.

## Run the tests

The tests do not need a Stripe account or network access.

```bash
npm install
npm test
```

## Run the server

1. Copy `.env.example` to `.env` and add your test keys.
2. In one terminal, run `stripe listen --forward-to localhost:4242/webhook`.
3. In a second terminal, run `npm start`.
4. In a third terminal, run `stripe trigger payment_intent.succeeded`.
