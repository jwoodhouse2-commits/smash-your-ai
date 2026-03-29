const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function createWebhookHandler(db) {
  return async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // If no webhook secret configured yet (pre-deploy), skip verification
    if (!endpointSecret) {
      console.warn('STRIPE_WEBHOOK_SECRET not set — webhook signature verification skipped');
      return res.status(400).json({ error: 'Webhook secret not configured.' });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: 'Invalid signature.' });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;

      if (userId && session.payment_status === 'paid') {
        try {
          db.prepare(
            'UPDATE users SET has_paid = 1, stripe_customer_id = ?, stripe_session_id = ?, updated_at = datetime(\'now\') WHERE id = ?'
          ).run(session.customer, session.id, parseInt(userId, 10));

          console.log(`Payment confirmed for user ${userId} (session ${session.id})`);
        } catch (err) {
          console.error('Failed to update user after payment:', err);
        }
      }
    }

    res.json({ received: true });
  };
}

module.exports = { createWebhookHandler };
