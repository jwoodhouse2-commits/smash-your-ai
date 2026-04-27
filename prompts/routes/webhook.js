const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function createWebhookHandler(db) {
  return async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.warn('STRIPE_WEBHOOK_SECRET not set. Webhook signature verification skipped.');
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
      const userIdRaw = session.client_reference_id;
      const productSlug = (session.metadata && session.metadata.product_slug) || 'bundle';

      if (userIdRaw && session.payment_status === 'paid') {
        const userId = parseInt(userIdRaw, 10);
        // A combo grants multiple underlying entitlements. Easy to extend later.
        const slugsToGrant = productSlug === 'course-plus-bundle'
          ? ['course-plus-bundle', 'course', 'bundle']
          : [productSlug];
        try {
          const insert = db.prepare(`
            INSERT OR IGNORE INTO user_entitlements (user_id, product_slug, stripe_session_id)
            VALUES (?, ?, ?)
          `);
          for (const slug of slugsToGrant) {
            insert.run(userId, slug, session.id);
          }

          // Keep the legacy has_paid flag in sync for any purchase that includes the bundle.
          if (slugsToGrant.includes('bundle')) {
            db.prepare(
              "UPDATE users SET has_paid = 1, stripe_customer_id = ?, stripe_session_id = ?, updated_at = datetime('now') WHERE id = ?"
            ).run(session.customer, session.id, userId);
          }

          console.log(`Entitlements granted: user ${userId} → ${slugsToGrant.join(', ')} (session ${session.id})`);
        } catch (err) {
          console.error('Failed to write entitlement after payment:', err);
        }
      }
    }

    res.json({ received: true });
  };
}

module.exports = { createWebhookHandler };
