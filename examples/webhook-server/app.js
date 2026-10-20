import express from 'express';
import Stripe from 'stripe';

export function createApp({ stripe, webhookSecret, handlers = {}, seen = new Set() }) {
  const app = express();

  // Stripe signs the exact bytes it sends. Keep the body raw on this route.
  app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        webhookSecret,
      );
    } catch (err) {
      console.error(`Signature check failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Stripe can deliver the same event more than once.
    if (seen.has(event.id)) {
      return res.json({ received: true, duplicate: true });
    }
    seen.add(event.id);

    const handler = handlers[event.type];
    if (handler) {
      handler(event.data.object);
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  });

  // Other routes can parse JSON as usual.
  app.use(express.json());

  return app;
}

export function createStripe(secretKey) {
  return new Stripe(secretKey);
}
