const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { requireAuth } = require('../middleware/auth');
const path = require('path');

function createCheckoutRouter(db) {
  const router = express.Router();

  function getProduct(slug) {
    return db.prepare('SELECT * FROM products WHERE slug = ?').get(slug);
  }

  function userHasEntitlement(userId, productSlug) {
    const row = db.prepare(
      'SELECT 1 FROM user_entitlements WHERE user_id = ? AND product_slug = ?'
    ).get(userId, productSlug);
    return !!row;
  }

  // POST /prompts/checkout/create-session  { product?: 'bundle' | 'course' }
  router.post('/create-session', requireAuth, async (req, res) => {
    try {
      const user = req.user;
      const productSlug = (req.body && req.body.product) || 'bundle';

      const product = getProduct(productSlug);
      if (!product) {
        return res.status(400).json({ error: `Unknown product: ${productSlug}` });
      }
      if (!product.stripe_price_id || product.stripe_price_id.startsWith('price_placeholder')) {
        return res.status(500).json({
          error: 'This product is not yet available. Please try again later.'
        });
      }

      // Already owns this product, skip checkout
      if (userHasEntitlement(user.id, productSlug) || (productSlug === 'bundle' && user.has_paid)) {
        return res.json({ redirect: '/dashboard' });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{ price: product.stripe_price_id, quantity: 1 }],
        customer_email: user.email,
        client_reference_id: String(user.id),
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}${productSlug === 'course' ? '/course' : '/prompts'}`,
        metadata: {
          user_id: String(user.id),
          product_slug: productSlug
        }
      });

      res.json({ url: session.url });
    } catch (err) {
      console.error('Checkout session error:', err);
      res.status(500).json({ error: 'Could not create checkout session. Please try again.' });
    }
  });

  // GET /prompts/checkout/success: verify payment and show success page
  router.get('/success', async (req, res) => {
    try {
      const sessionId = req.query.session_id;
      if (!sessionId) return res.redirect('/prompts');

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid' && session.client_reference_id) {
        const userId = parseInt(session.client_reference_id, 10);
        const productSlug = (session.metadata && session.metadata.product_slug) || 'bundle';
        const slugsToGrant = productSlug === 'course-plus-bundle'
          ? ['course-plus-bundle', 'course', 'bundle']
          : [productSlug];

        const insert = db.prepare(`
          INSERT OR IGNORE INTO user_entitlements (user_id, product_slug, stripe_session_id)
          VALUES (?, ?, ?)
        `);
        for (const slug of slugsToGrant) insert.run(userId, slug, session.id);

        if (slugsToGrant.includes('bundle')) {
          db.prepare(
            "UPDATE users SET has_paid = 1, stripe_customer_id = ?, stripe_session_id = ?, updated_at = datetime('now') WHERE id = ?"
          ).run(session.customer, session.id, userId);

          if (req.session.user && req.session.user.id === userId) {
            req.session.user.has_paid = 1;
          }
        }
      }

      res.sendFile(path.join(__dirname, '..', 'views', 'success.html'));
    } catch (err) {
      console.error('Success page error:', err);
      res.sendFile(path.join(__dirname, '..', 'views', 'success.html'));
    }
  });

  return router;
}

module.exports = { createCheckoutRouter };
