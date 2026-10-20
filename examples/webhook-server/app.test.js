import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp, createStripe } from './app.js';

const secret = 'whsec_test_secret';
const stripe = createStripe('sk_test_dummy');

function start(handlers) {
  const app = createApp({ stripe, webhookSecret: secret, handlers });
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

function post(server, body, signature) {
  const { port } = server.address();
  return fetch(`http://localhost:${port}/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'stripe-signature': signature },
    body,
  });
}

const payload = JSON.stringify({
  id: 'evt_test_1',
  object: 'event',
  type: 'payment_intent.succeeded',
  data: { object: { id: 'pi_test_1', amount: 2000, currency: 'usd' } },
});

test('accepts a correctly signed event and runs the handler', async () => {
  let received;
  const server = await start({ 'payment_intent.succeeded': (pi) => { received = pi.id; } });
  const sig = stripe.webhooks.generateTestHeaderString({ payload, secret });
  const res = await post(server, payload, sig);
  assert.equal(res.status, 200);
  assert.equal(received, 'pi_test_1');
  server.close();
});

test('rejects an event signed with the wrong secret', async () => {
  const server = await start({});
  const sig = stripe.webhooks.generateTestHeaderString({ payload, secret: 'whsec_wrong' });
  const res = await post(server, payload, sig);
  assert.equal(res.status, 400);
  server.close();
});

test('rejects a body that changed after signing', async () => {
  const server = await start({});
  const sig = stripe.webhooks.generateTestHeaderString({ payload, secret });
  const res = await post(server, payload.replace('2000', '1'), sig);
  assert.equal(res.status, 400);
  server.close();
});

test('runs the handler once when the same event arrives twice', async () => {
  let calls = 0;
  const server = await start({ 'payment_intent.succeeded': () => { calls += 1; } });
  const sig = stripe.webhooks.generateTestHeaderString({ payload, secret });
  await post(server, payload, sig);
  const res = await post(server, payload, sig);
  assert.deepEqual(await res.json(), { received: true, duplicate: true });
  assert.equal(calls, 1);
  server.close();
});
