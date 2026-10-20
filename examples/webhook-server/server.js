import { createApp, createStripe } from './app.js';

const stripe = createStripe(process.env.STRIPE_SECRET_KEY);

const app = createApp({
  stripe,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  handlers: {
    'payment_intent.succeeded': (paymentIntent) => {
      console.log(`Payment succeeded: ${paymentIntent.id} for ${paymentIntent.amount} ${paymentIntent.currency}`);
    },
    'payment_intent.payment_failed': (paymentIntent) => {
      console.log(`Payment failed: ${paymentIntent.id}`);
    },
  },
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Listening on http://localhost:${port}/webhook`));
